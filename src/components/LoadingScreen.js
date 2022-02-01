import { BorderSpinner, Column, EmptyBox, P } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (show) => {
     const [theme] = getState("current-theme");

     return Column({
          flags: {
               renderIf: show === true,
          },
          style: {
               position: "fixed",
               inset: "0px",
               backgroundColor: "#000000ee",
               justifyContent: "center",
               alignItems: "center",
               height: "100%",
               width: "100%",
               zIndex: 2,
          },
          children: [
               BorderSpinner({ color: theme.color }),
               EmptyBox({ height: "10px" }),
               P({
                    text: "Publishing your post...",
                    style: { color: "white" },
               }),
          ],
     });
};
