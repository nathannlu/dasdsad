import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import styled from '@emotion/styled';

const options = {
    style: {
        base: {
            fontSize: '16px',
            lineHeight: '1.4375em',
            fontWeight: 400,
        },
    },
};

const StyledCardElement = styled(CardElement)`
    padding: 8.5px 14px;
    margin: 0;
    height: 1.4375em;
    border-radius: 2px;
`;

export default () => <StyledCardElement options={options} />;
