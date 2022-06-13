import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useSetEmbedButtonCss } from 'services/blockchain/gql/hooks/contract.hook.js';
import { getBlockchainChainId } from '@ambition-blockchain/controllers';

const DEFAULT_STYLES = {
    backgroundColor: {
        value: undefined,
        type: 'color',
        label: 'Button Color'
    },
    color: {
        value: undefined,
        type: 'color',
        label: 'Button Text Color'
    },
    fontSize: {
        value: undefined,
        type: 'number',
        label: 'Button Text Size'
    },
    borderRadius: {
        value: undefined,
        type: 'number',
        label: 'Corner Radius'
    },
    px: {
        value: undefined,
        type: 'number',
        label: 'Horizontal Spacing'
    },
    py: {
        value: undefined,
        type: 'number',
        label: 'Vertical Spacing'
    }
}

export const useEmbedBttonStyling = (contract, id) => {
    const { addToast } = useToast();
    const [setEmbedButtonCss] = useSetEmbedButtonCss({});

    const [state, setState] = useState({
        cssContext: {
            'connect-button': { ...DEFAULT_STYLES },
            'mint-button': { ...DEFAULT_STYLES },
            'details-container': { ...DEFAULT_STYLES },
            'details': { ...DEFAULT_STYLES }
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

    const loadEmbedButtonIframe = () => {
        const iframeElement = document.getElementById('embed-button-iframe');
        if (!iframeElement) {
            return;
        }

        const iframe = iframeElement?.contentWindow.document;
        const ambitionButton = document.createElement("ambition-button");

        const chainid = document.createAttribute("chainid");
        const contractaddress = document.createAttribute("contractaddress");
        const type = document.createAttribute("type");
        const renderLogo = document.createAttribute("renderlogo");
        const classes = document.createAttribute("classes");

        chainid.value = getBlockchainChainId(contract?.blockchain);
        contractaddress.value = contract?.address;
        type.value = contract?.type;
        renderLogo.value = "false";
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
        const css = `
            .connect-button {
                background-color: ${state.cssContext['connect-button']['backgroundColor']['value']} !important; 
                color: ${state.cssContext['connect-button']['color']['value']} !important; 
                font-size: ${state.cssContext['connect-button']['fontSize']['value']}px !important; 
                border-radius: ${state.cssContext['connect-button']['borderRadius']['value']}px !important; 
                margin: ${state.cssContext['connect-button']['py']['value'] || 0}px ${state.cssContext['connect-button']['px']['value'] || 0}px !important; 
            }
            .mint-button {
                background-color: ${state.cssContext['mint-button']['backgroundColor']['value']} !important; 
                color: ${state.cssContext['mint-button']['color']['value']} !important; 
                font-size: ${state.cssContext['mint-button']['fontSize']['value']}px !important; 
                border-radius: ${state.cssContext['mint-button']['borderRadius']['value']}px !important; 
                margin: ${state.cssContext['mint-button']['py']['value'] || 0}px ${state.cssContext['connect-button']['px']['value'] || 0}px !important; 
            }
            .details-container {}
            .details {}
        `;

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

    return {
        ...state,
        loadEmbedButtonIframe,
        save,
        onChange
    };
};


