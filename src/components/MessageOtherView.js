import { Column, P } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (msg) => {
     const [theme] = getState("current-theme");

     return Column({
          style: { maxWidth: "60%", marginRight: "auto" },
          children: [
               P({
                    text: msg.text,
                    styleSheet: {
                         className: "other-message",
                         normal: {
                              background: theme.secondaryHover,
                              color: theme.text,
                              padding: "10px",
                              paddingRight: "20px",
                              borderRadius: "0px 20px 20px 0px",
                              marginTop: "10px",
                         },
                    },
               }),
          ],
     });
};
