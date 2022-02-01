import { Input } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (state, type, placeholder = "placeholder") => {
     const [theme] = getState("current-theme");
     const [value, setValue] = state;

     return Input({
          type,
          value: value,
          placeholder,
          events: {
               onChange: (e) => {
                    setValue(e.target.value);
               },
          },
          styleSheet: {
               className: "input-view",
               normal: {
                    margin: "5px 0px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "none",
                    border: `1px solid ${theme.secondaryHover}`,
                    color: "inherit",
               },
               focus: {
                    borderColor: "transparent",
                    outline: `2px solid ${theme.color}`,
               },
               placeholder: {
                    color: theme.secondaryHover,
               },
          },
     });
};
