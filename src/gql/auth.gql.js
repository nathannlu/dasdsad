import { gql } from '@apollo/client';

export const FORGOT_PASSWORD = gql`
    query SendPasswordResetEmail($email: String!) {
        sendPasswordResetEmail(email: $email)
    }
`;
export const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $token: String!) {
        resetPassword(password: $password, token: $token) {
            email
            password
        }
    }
`;
export const VALIDATE_TOKEN = gql`
    query validatePasswordResetLink($token: String!) {
        validatePasswordResetLink(token: $token)
    }
`;
