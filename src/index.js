import { Recursive, Style } from "@riadh-adrani/recursive";
import { DevMode } from "@riadh-adrani/recursive/Recursive";
import App from "./App";

DevMode(false);

// Create a style Sheet
Style.SetStyle({
     import: [
          "url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap')",
     ],
     selectors: {
          "*": {
               lineHeight: 1.35,
          },
          "body,html": {
               fontFamily: "Ubuntu",
               margin: "0px",
          },
          p: {
               margin: "0px",
          },
          "h1,h2,h3,h4,h5,h6": {
               margin: "0px",
               padding: "5px 0px",
          },
          "app-view": {
               minHeight: "100vh",
          },
          ".sliding-gradient": {
               backgroundSize: "300% 300%",
               backgroundPosition: "00% 33%",
               animation: "gradient 2s linear infinite",
          },
     },
     animations: {
          gradient: {
               "0%": { backgroundPosition: "0% 0%" },
               "100%": { backgroundPosition: "100% 0%" },
          },
     },
});

// Render your app
Recursive.Render(App);
