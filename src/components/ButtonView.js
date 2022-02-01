import { Button } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default ({ text, onClick, style, renderIf = true }) => {
     const [theme] = getState("current-theme");

     return Button({
          flags: {
               renderIf,
          },
          text,
          events: {
               onClick,
          },
          style,
          styleSheet: {
               className: "stnd-button-view",
               normal: {
                    background: theme.main,
                    border: `1px solid ${theme.color}`,
                    padding: "10px 20px",
                    borderRadius: "20px",
                    color: theme.color,
               },
               hover: {
                    background: theme.color,
                    color: theme.main,
                    cursor: "pointer",
               },
          },
     });
};
