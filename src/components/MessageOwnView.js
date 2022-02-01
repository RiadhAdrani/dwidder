import { Column, P } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (msg) => {
     const [theme] = getState("current-theme");

     return Column({
          style: { maxWidth: "60%", marginLeft: "auto" },
          children: [
               P({
                    text: msg.text,
                    styleSheet: {
                         className: "own-message",
                         normal: {
                              marginTop: "10px",
                              background: theme.color,
                              color: "white",
                              padding: "10px",
                              paddingLeft: "20px",
                              borderRadius: "20px 0px 0px 20px",
                         },
                    },
               }),
          ],
     });
};
