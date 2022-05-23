import { createTheme } from '@mui/material';

// light: will be calculated from palette.primary.main,
// dark: will be calculated from palette.primary.main,
// contrastText: will be calculated to contrast with palette.primary.main
const theme = createTheme({
    palette: {
        primary: {
            main: '#006aff',
        },
        secondary: {
            main: '#0044ff',
        },
        grey: {
            main: '#f5f5f5',
        },
        black: {
            main: '#000000',
        },
        text: {
            primary: 'rgba(0,0,0,.87)',
        },
    },

    typography: {
        h1: {
            fontSize: '3.6rem',
        },
    },

    shape: {
        borderRadius: 2,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                sizeMedium: {
                    padding: '15px 25px',
                },
            },
        },

        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    color: 'rgba(39,39,39,.87)',
                },
            },
        },

        MuiInput: {
            styleOverrides: {
                root: {

                    /*
					transition: 'all .2s ease',
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'unset'
					}
					*/
                },


            },
        },
    },
});

export default theme;
