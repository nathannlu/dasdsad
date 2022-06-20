import React from 'react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

// import App from '../src/app';
// import { AppSnackbarProvider } from '../src/contexts/snackbar.context';

function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});