import { Input } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (loading, value, onChange) => {
     const [theme] = getState("current-theme");

     return Input({
          type: "text",
          value,
          disabled: loading,
          placeholder: "Write something...",
          events: { onChange },
          styleSheet: {
               className: "new-comment-input-view",
               normal: {
                    flex: 1,
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
