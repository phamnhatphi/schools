export default {
    errors: {
        unauthorizedResponse: 'Your login session has expired. Please try again after logging in. ',
        loginFailResponse: 'Authentication failed. Please check your login ID or password and try again. ',
        unknownResponse: 'There was an error with your API request. ',
        confirmPasswordUnmatched: 'Password and confirmation do not match. ',
        confirmPasswordEmpty: 'This field may not be blank.',
    },
    successes: {
        sendEmailToResetPassword: 'A password reset link has been emailed to you',
        resetPassword: 'Password reset completed',
        createUser: 'Account registration completed. ',
        updateUser: 'Successfully edited the account. ',
        deleteUser: 'Account deletion completed. ',
    },
    infos: {
        responseWaiting: 'Waiting for response',
        loading: 'Loading',
    },
};
