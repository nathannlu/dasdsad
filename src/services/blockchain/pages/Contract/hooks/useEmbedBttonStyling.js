import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useSetEmbedButtonCss } from 'services/blockchain/gql/hooks/contract.hook.js';
import { getBlockchainChainId } from '@ambition-blockchain/controllers';

// elementType: 'button' | undefined; 
const DEFAULT_STYLES = (elementType) => ({
    backgroundColor: {
        value: undefined,
        type: 'color',
        label: elementType === 'button' && 'Button Color' || 'Background Color'
    },
    color: {
        value: undefined,
        type: 'color',
        label: elementType === 'button' && 'Button Text Color' || 'Text Color'
    },
    fontSize: {
        value: undefined,
        type: 'number',
        label: elementType === 'button' && 'Button Font Size' || 'Font Size'
    },
    borderRadius: {
        value: '4',
        type: 'slider',
        label: 'Corner Radius'
    },
    margin: {
        value: [0,0,0,0],
        type: 'direction',
        label: 'Margin: Outer Spacing'
    },
    padding: {
        value: [6,16,6,16],
        type: 'direction',
        label: 'Padding: Inner Spacing'
    }
});

const TEXT_STYLES = {
    lineHeight: {
        value: undefined,
        type: 'number',
        label: 'Line Height'
    },
    letterSpacing: {
        value: undefined,
        type: 'number',
        label: 'Letter Spacing'
    },
    fontWeight: {
        value: false,
        type: 'toggle',
        label: 'Style'
    },
    textDecoration: {
        value: false,
        type: 'toggle',
        label: ''
    },
    fontStyle: {
        value: false,
        type: 'toggle',
        label: ''
    }
}

export const useEmbedBttonStyling = (contract, id) => {
    const { addToast } = useToast();
    const [setEmbedButtonCss] = useSetEmbedButtonCss({});
    const [isSaving, setIsSaving] = useState(false);

    const [state, setState] = useState({
        cssContext: {
            'connect-button': { ...DEFAULT_STYLES('button'), ...TEXT_STYLES },
            'mint-button': { ...DEFAULT_STYLES('button'), ...TEXT_STYLES },
            'details-container': { ...DEFAULT_STYLES() },
            'details': { ...DEFAULT_STYLES() }
        }
    });

    const onTxnError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    const onTxnInfo = () => {
        addToast({
            severity: 'info',
            message:
                'Sending transaction to Ethereum. This might take a couple of seconds...',
        });
    };

    const onTxnSuccess = () => {
        addToast({
            severity: 'success',
            message: `Transaction success`,
        });
    };

    const save = async () => {
        setIsSaving(true);
        await setEmbedButtonCss({ variables: { id, css: JSON.stringify(state.cssContext) } });
        setIsSaving(false);
    }

    const getCssString = (cssContext) => {
        return `
            .connect-button {
                background-color: ${cssContext?.['connect-button']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['connect-button']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['connect-button']?.['fontSize']?.['value'] || 14}px !important; 
                border-radius: ${cssContext?.['connect-button']?.['borderRadius']?.['value'] || 4}px !important; 
                margin: ${cssContext?.['connect-button']?.['margin']?.['value']?.join('px ') || 0}px !important;
                padding: ${cssContext?.['connect-button']?.['padding']?.['value']?.join('px ') || '6px 16px'} !important;
                font-weight: ${cssContext?.['connect-button']?.['fontWeight']?.['value'] ? 'bold' : 'initial' || 'initial'} !important;
                font-style: ${cssContext?.['connect-button']?.['fontStyle']?.['value'] ? 'italic' : 'initial' || 'initial'} !important;
                text-decoration: ${cssContext?.['connect-button']?.['textDecoration']?.['value'] ? 'underline' : 'initial' || 'initial'} !important;
                line-height: ${cssContext?.['connect-button']?.['lineHeight']?.['value'] || 1.75} !important; 
                letter-spacing: ${cssContext?.['connect-button']?.['letterSpacing']?.['value'] || 0.45712}px !important;
            }
            .mint-button {
                background-color: ${cssContext?.['mint-button']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['mint-button']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['mint-button']?.['fontSize']?.['value'] || 14}px !important; 
                border-radius: ${cssContext?.['mint-button']?.['borderRadius']?.['value'] || 4}px !important; 
                margin: ${cssContext?.['mint-button']?.['margin']?.['value']?.join('px ') || 0}px !important;
                padding: ${cssContext?.['mint-button']?.['padding']?.['value']?.join('px ') || '6px 16px'} !important;
                font-weight: ${cssContext?.['mint-button']?.['fontWeight']?.['value'] ? 'bold' : 'initial' || 'initial'} !important;
                font-style: ${cssContext?.['mint-button']?.['fontStyle']?.['value'] ? 'italic' : 'initial' || 'initial'} !important;
                textDecoration: ${cssContext?.['mint-button']?.['textDecoration']?.['value'] ? 'underline' : 'initial' || 'initial'} !important;
                line-height: ${cssContext?.['mint-button']?.['lineHeight']?.['value'] || 1.75} !important; 
                letter-spacing: ${cssContext?.['mint-button']?.['letterSpacing']?.['value'] || 0.45712}px !important;
            }
            .details-container {
                background-color: ${cssContext?.['details-container']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['details-container']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['details-container']?.['fontSize']?.['value'] || 14}px !important; 
                border-radius: ${cssContext?.['details-container']?.['borderRadius']?.['value'] || 4}px !important; 
                margin: ${cssContext?.['details-container']?.['margin']?.['value']?.join('px ') || 0}px !important;
                padding: ${cssContext?.['details-container']?.['padding']?.['value']?.join('px ') || '6px 16px'} !important;
            }
            .details {
                background-color: ${cssContext?.['details']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['details']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['details']?.['fontSize']?.['value'] || 14}px !important; 
                border-radius: ${cssContext?.['details']?.['borderRadius']?.['value'] || 4}px !important; 
                margin: ${cssContext?.['details']?.['margin']?.['value']?.join('px ') || 0}px !important;
                padding: ${cssContext?.['details']?.['padding']?.['value']?.join('px ') || '6px 16px'} !important;
            }

            .details p,
            .details p b {
                color: inherit !important;
            }
        `};

    const handleIframeOnLoad = () => {
        const iframeElement = document.getElementById('embed-button-iframe');
        if (!iframeElement) {
            return;
        }

        const iframe = iframeElement?.contentWindow.document;
        const ambitionButton = document.createElement("ambition-button");

        const renderLogo = document.createAttribute("renderlogo");
        const chainid = document.createAttribute("chainid");
        const contractaddress = document.createAttribute("contractaddress");
        const type = document.createAttribute("type");
        const classes = document.createAttribute("classes");

        renderLogo.value = "false";
        chainid.value = getBlockchainChainId(contract?.blockchain);
        contractaddress.value = contract?.address;
        type.value = contract?.type;
        classes.value = JSON.stringify({
            'connect-button': 'connect-button',
            'mint-button': 'mint-button',
            'details-container': 'details-container',
            'details': 'details'
        });

        ambitionButton.setAttributeNode(chainid);
        ambitionButton.setAttributeNode(contractaddress);
        ambitionButton.setAttributeNode(type);
        ambitionButton.setAttributeNode(classes);
        ambitionButton.setAttributeNode(renderLogo);

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.jsdelivr.net/gh/ambition-so/embed-prod-build@main/bundle.js";

        const style = document.createElement('style');
        const css = getCssString(state.cssContext);

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        iframe.body.append(ambitionButton);
        iframe.head.append(style);
        iframe.head.append(script);
    }

    const onChange = (value, key, styleKey, data = {}) => {
        //console.log({ value, key, styleKey })

        let newValue = value;

        if (data?.type === 'direction') {
            newValue = [...data?.valueArray];
            newValue[data?.index] = value;
        }

        let newState = {...state};
        newState.cssContext[key][styleKey].value = newValue;
        setState(newState);

        setTimeout(() => handleIframeOnLoad(), 500);
    };

    const setCssContext = (cssContext) => setState(prevState => ({ ...prevState, cssContext: { ...prevState.cssContext, ...cssContext } }));

    return {
        ...state,
        setCssContext,
        handleIframeOnLoad,
        save,
        onChange,
        getCssString,
        isSaving
    };
};


