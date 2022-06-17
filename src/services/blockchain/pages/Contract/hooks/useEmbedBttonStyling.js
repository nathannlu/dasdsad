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
        label: elementType === 'button' && 'Button Text Color' || 'text Color'
    },
    fontSize: {
        value: undefined,
        type: 'number',
        label: elementType === 'button' && 'Button Text Size' || 'Text Size'
    },
    borderRadius: {
        value: undefined,
        type: 'number',
        label: 'Corner Radius'
    },
    mx: {
        value: undefined,
        type: 'number',
        label: 'Horizontal Spacing'
    },
    my: {
        value: undefined,
        type: 'number',
        label: 'Vertical Spacing'
    }
});

export const useEmbedBttonStyling = (contract, id) => {
    const { addToast } = useToast();
    const [setEmbedButtonCss] = useSetEmbedButtonCss({});

    const [state, setState] = useState({
        cssContext: {
            'connect-button': { ...DEFAULT_STYLES('button') },
            'mint-button': { ...DEFAULT_STYLES('button') },
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

    const save = () => {
        setEmbedButtonCss({ variables: { id, css: JSON.stringify(state.cssContext) } });
    }

    const getCssString = (cssContext) => {
        return `
            .connect-button {
                background-color: ${cssContext?.['connect-button']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['connect-button']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['connect-button']?.['fontSize']?.['value']}px !important; 
                border-radius: ${cssContext?.['connect-button']?.['borderRadius']?.['value']}px !important; 
                margin: ${cssContext?.['connect-button']?.['my']?.['value'] || 0}px ${cssContext?.['connect-button']?.['mx']?.['value'] || 0}px !important; 
            }
            .mint-button {
                background-color: ${cssContext?.['mint-button']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['mint-button']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['mint-button']?.['fontSize']?.['value']}px !important; 
                border-radius: ${cssContext?.['mint-button']?.['borderRadius']?.['value']}px !important; 
                margin: ${cssContext?.['mint-button']?.['my']?.['value'] || 0}px ${cssContext?.['connect-button']?.['mx']?.['value'] || 0}px !important; 
            }
            .details-container {
                background-color: ${cssContext?.['details-container']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['details-container']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['details-container']?.['fontSize']?.['value']}px !important; 
                border-radius: ${cssContext?.['details-container']?.['borderRadius']?.['value']}px !important; 
                margin: ${cssContext?.['details-container']?.['my']?.['value'] || 0}px ${cssContext?.['connect-button']?.['mx']?.['value'] || 0}px !important; 
            }
            .details {
                background-color: ${cssContext?.['details']?.['backgroundColor']?.['value']} !important; 
                color: ${cssContext?.['details']?.['color']?.['value']} !important; 
                font-size: ${cssContext?.['details']?.['fontSize']?.['value']}px !important; 
                border-radius: ${cssContext?.['details']?.['borderRadius']?.['value']}px !important; 
                margin: ${cssContext?.['details']?.['my']?.['value'] || 0}px ${cssContext?.['connect-button']?.['mx']?.['value'] || 0}px !important; 
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

    const onChange = (value, key, styleKey) => {
        console.log({ value, key, styleKey })

        setState(prevState => ({
            ...prevState,
            cssContext: {
                ...prevState.cssContext,
                [key]: {
                    ...prevState.cssContext[key],
                    [styleKey]: {
                        ...prevState.cssContext[key][styleKey],
                        value
                    }
                }
            }
        }))
    };

    const setCssContext = (cssContext) => setState(prevState => ({ ...prevState, cssContext: { ...prevState.cssContext, ...cssContext } }));

    return {
        ...state,
        setCssContext,
        handleIframeOnLoad,
        save,
        onChange,
        getCssString
    };
};


