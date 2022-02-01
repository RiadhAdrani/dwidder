import { Button } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (text, onClick) => {
     const [theme] = getState("current-theme");

     return Button({
          text: text,
          styleSheet: {
               className: "edit-button-themed",
               normal: {
                    background: theme.main,
                    border: `1px solid ${theme.color}`,
                    padding: "10px 20px",
                    margin: "2.5px",
                    borderRadius: "20px",
                    color: theme.color,
               },
               hover: {
                    background: theme.color,
                    color: theme.main,
                    cursor: "pointer",
               },
          },
          events: {
               onClick,
          },
     });
};
