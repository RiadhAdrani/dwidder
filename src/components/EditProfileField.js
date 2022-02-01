import { P, Row, TextArea } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (name, value, maxLength = 200, onChange) => {
     const [theme] = getState("current-theme");

     return Row({
          children: [
               P({ text: name, style: { padding: "5px", marginRight: "10px" } }),
               TextArea({
                    type: "text",
                    value,
                    maxLength,
                    styleSheet: {
                         className: "edit-profile-field",
                         normal: {
                              background: "none",
                              color: "inherit",
                              maxHeight: "100px",
                              height: "3em",
                              font: "inherit",
                              resize: "vertical",
                              flex: 1,
                              border: "none",
                              borderBottom: `2px solid ${theme.secondaryHover}`,
                         },
                         focus: {
                              outline: "none",
                              borderBottomColor: theme.color,
                         },
                    },
                    events: { onChange },
               }),
          ],
     });
};
