import { Input, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (name, value, maxLength = 100, onChange) => {
     const [theme] = getState("current-theme");

     return Row({
          children: [
               P({
                    text: name,
                    style: { padding: "5px", marginRight: "10px", alignSelf: "center" },
               }),
               Input({
                    type: "text",
                    value,
                    maxLength,
                    styleSheet: {
                         className: "edit-profile-field",
                         normal: {
                              background: "none",
                              color: "inherit",
                              font: "inherit",
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
