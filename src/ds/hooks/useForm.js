// Hnadles onChange of input types
import React, { useState, useCallback } from 'react';

// Maps fields from config to input
const convertToFormState = (config) => {
    const keys = Object.keys(config);
    let state = { ...config };

    keys.map((key) => {
        state[key] = {
            value: config[key].default,
            placeholder: config[key].placeholder,
        };
    });
    return state;
};

export const useForm = (config) => {
    // Config includes the schema for the form
    const [formState, setFormState] = useState(convertToFormState(config));

    // onChange
    const setValue = useCallback(
        (values) => {
            const key = Object.keys(values);

            setFormState((prevState) => {
                prevState[key].value = values[key];

                return { ...prevState };
            });
        },
        [config]
    );

    // adds onChange to input object
    const generateFormFields = () => {
        let populatedPropsForm = { ...formState };

        Object.keys(formState).map((key) => {
            populatedPropsForm[key] = {
                ...populatedPropsForm[key],
                onChange: (e) => {
                    setValue({ [key]: e.target.value });
                },
            };
        });

        return populatedPropsForm;
    };
    const form = generateFormFields();

    return {
        form,
        formState,
        setFormState,
    };
};
