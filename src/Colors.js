import { getState } from "@riadh-adrani/recursive/Recursive-State";

const Common = {
     color: "#1e9eae",
     danger: "#9e1e1e",
     liked: "#be1e1e",
     shared: "#1ebe1e",
     commented: "#3391e1",
};

const Day = {
     name: "Day",
     main: "#ffffff",
     mainHover: "#9e9e9e",
     secondary: "#f5f5f5",
     secondaryHover: "#cccccc",
     text: "#000000",
     textContrast: "#ffffff",
     ...Common,
};

const Night = {
     name: "Night",
     main: "#1e1e1e",
     mainHover: "#1c1c1c",
     secondary: "#1b1b1b",
     secondaryHover: "#5f5f5f",
     text: "#fefefe",
     textContrast: "#1e1e1e",
     ...Common,
};

const Abyss = {
     name: "Abyss",
     main: "#0e0e0e",
     mainHover: "#2c2c2c",
     secondary: "#0b0b0b",
     secondaryHover: "#2f2f2f",
     text: "#fefefe",
     textContrast: "#0e0e0e",
     ...Common,
};

const GetThemes = () => {
     return [Day, Night, Abyss];
};

const GetTheme = (name) => {
     const obj = GetThemes().find((th) => th.name === name);
     const index = GetThemes().indexOf(obj);
     return index !== -1 ? GetThemes()[index] : Day;
};

const MakeLoadingGradient = () => {
     const [theme] = getState("current-theme");

     return `linear-gradient(90deg, 
        ${theme.mainHover} 0%, 
        ${theme.secondaryHover} 16%, 
        ${theme.secondary} 33%, 
        ${theme.secondary} 44%, 
        ${theme.secondaryHover} 55%, 
        ${theme.mainHover} 67%, 
        ${theme.secondaryHover} 84%, 
        ${theme.secondary} 100%)`;
};

export { GetTheme, GetThemes, MakeLoadingGradient };
