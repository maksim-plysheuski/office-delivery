import { createTheme } from "@mui/material/styles";
import {
  inputBaseClasses,
  outlinedInputClasses,
  Paper,
} from "@mui/material";
import {bgColors, grayColors} from "./constants";



const theme = createTheme({
  palette: {
    primary: {
      main: "#5B76FF",
      light: "#798AFF",
    },
    secondary: {
      main: "#2A2A33",
      light: "#33333D",
    },
    success: { main: "#91C951", light: "#AFE76F" },
    warning: {
      main: "#FFA41D",
    },
    error: {
      main: "#FF5569",
      light: "#FF7387",
    },
    divider: "#2B2B33",
    text: { primary: "#BFBFC3", secondary: "#EFEFF0", disabled: "#7C818A" },
    background: { default: "#0E0E16", paper: "#1C1C25" },
    grey: {
      "100": "#6F6F78",
      "200": "#7F7F87",
      "300": "#8F8F96",
      "400": "#9F9FA5",
      "500": "#BFBFC3",
      "600": "#EFEFF0",
    },
  },
  typography: {
    fontFamily: "Open Sans",
    body1: {
      fontSize: "12px",
    },
    h1: { fontSize: "24px", letterSpacing: 0.7, fontWeight: 600 },
    h2: { fontSize: "18px", letterSpacing: 0.7, fontWeight: 600 },
    h3: {
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: "18px",
    },
    h4: {
      fontSize: "10px",
      fontWeight: 600,
      lineHeight: "14px",
      letterSpacing: "0.02em",
    },
    button: {
      fontSize: "12px",
    },
  },
  components: {
    MuiStack: { defaultProps: { gap: 1 } },
    MuiCssBaseline: {
      styleOverrides: {
        "#root": {
          width: "100%",
          height: "100vh",
          overflow: "auto",
        },
        body: {
          colorScheme: "dark",
          overflow: "hidden",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "transparent",
            padding: "0px",
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: "9999px",
            backgroundColor: "#4F4F5A",
            cursor: "pointer",
            border: "2px solid rgba(0, 0, 0, 0)",
            backgroundClip: "padding-box",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#6d6d6d",
            },
        },
      },
    },


    MuiInputLabel: {
      styleOverrides: {
        asterisk: ({ theme }) => ({
          color: theme.palette.error.main,
        }),
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: "36px",
          height: "16px",
          padding: "0px",
          borderRadius: "8px",
          boxSizing: "border-box",
          "&:has(.Mui-disabled)": {
            opacity: 0.3,
          },
        },
        switchBase: {
          height: "100%",
          padding: "0px",
          transform: "translateX(1px)",
          boxSizing: "border-box",
          "&.Mui-checked": {
            transform: "translateX(15px)",
            color: "white",
            "& .MuiSwitch-thumb": {
              color: grayColors["600"],
              mask: "url(./src/assets/svg/switch-checked-icon.svg),  linear-gradient(#000 0 0)",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskComposite: "exclude",
            },
          },
        },
        thumb: ({ theme }) => ({
          height: "14px",
          width: "20px",
          borderRadius: "7px",
          boxShadow: "none",
          color: theme.palette.text.disabled,
          transition: "color 0.2s",
          mask: "url(./src/assets/svg/switch-icon.svg),  linear-gradient(#000 0 0)",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskComposite: "exclude",
        }),
        track: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          opacity: "1 !important",
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 1,
          padding: "8px 6px",
          gap: 12,
          transition: "background-color 0.1s",
          "&:hover": {
            backgroundColor: "#33333D !important",
          },
          "&.Mui-selected": {
            backgroundColor: "unset",
          },
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {

        PaperComponent: (props) => <Paper {...props} elevation={8} />,
      },
      styleOverrides: {
        popupIndicator: {
          padding: 8,
          transition: "transform 0.2s",
        },
        inputRoot: {
          padding: 4,
          "& .MuiInputBase-input::placeholder": {
            opacity: 1,
          },
        },
        option: {
          borderRadius: 8,
          marginBottom: 1,
          padding: "8px 6px !important",
          transition: "background-color 0.1s",
          "&:hover.Mui-focused": {
            backgroundColor: "#33333D !important",
          },
          '&[aria-selected="true"]': {
            backgroundColor: "unset !important",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          transition: "border-color 0.2s",
        },
        root: ({ theme }) => ({
          borderRadius: 8,
          [`&:hover:not(.Mui-disabled) .${outlinedInputClasses.notchedOutline}`]:
            {
              borderColor: theme.palette.grey[500],
            },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.grey[500],
            borderWidth: 1,
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          colorScheme: "dark",
          color: theme.palette.grey[500],
          backgroundColor: "#25252E",
          borderRadius: 8,
          [`& .${inputBaseClasses.input}`]: {
            padding: "12px 16px",
            paddingRight: 0,
          },
        }),
      },
    },
    MuiInputAdornment: {
      styleOverrides: { root: { marginLeft: 0 } },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          return {
            minHeight: "44px",
            textTransform: "initial",
            borderRadius: 8,
            backgroundColor:
              ownerState.variant === "text" ? "unset" : undefined,
            color:
              ownerState.color === "secondary"
                ? theme.palette.text.primary
                : undefined,
            fontWeight: 600,
            padding: "6px 14px",
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              backgroundColor:
                ownerState.variant === "contained"
                  ? theme.palette.secondary.main
                  : undefined,
            },
            "&:hover": {
              color:
                ownerState.variant === "text"
                  ? ownerState.color === "secondary"
                    ? theme.palette.text.secondary
                    : theme.palette[
                        ownerState.color && ownerState.color !== "inherit"
                          ? ownerState.color
                          : "primary"
                      ].light
                  : undefined,
              backgroundColor:
                ownerState.variant !== "text"
                  ? theme.palette[
                      ownerState.color && ownerState.color !== "inherit"
                        ? ownerState.color
                        : "primary"
                    ].light
                  : undefined,
            },
          };
        },
        sizeSmall: {
          padding: "6px 8px",
          fontSize: "12px",
        },
      },
    },
    MuiPopper: {
      defaultProps: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
        ],
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "#2B2B33",
          padding: "10px 16px",
        },
        elevation8: ({ theme }) => ({
          borderRadius: 8,
          padding: 8,
          borderColor: theme.palette.grey[500],
          backgroundColor: "#212129",
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#7c7c7c",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderTop: `2px solid ${bgColors["100"]}`,
          padding: 0,
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&::before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-content": {
            margin: 0,
            marginLeft: 2,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
