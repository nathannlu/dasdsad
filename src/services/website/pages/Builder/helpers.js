import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { Settings } from './Viewport/SettingsPanel';

// Returns a CraftJS component
const generator = (TemplateComponent, defaultProps) => {
    const Template = (props) => {
        const {
            connectors: { connect, drag },
        } = useNode();

        return (
            <div ref={(ref) => connect(ref)}>
                <TemplateComponent {...props} />
            </div>
        );
    };

    Template.craft = {
        related: { settings: Settings },
        props: defaultProps,
    };

    return Template;
};

// Turns array into an object of templates
// e.g.  { keyA: props => {...}, keyB: props => {...} }
export const convertToList = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: generator(item.template, item.defaults),
        };
    }, initialValue);
};
