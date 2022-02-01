import { Column, EmptyBox, I, P } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (feed, number) => {
     const [theme] = getState("current-theme");

     return Column({
          flags: { renderIf: number >= feed.length },
          styleSheet: {
               className: "feed-end",
               normal: {
                    alignItems: "center",
                    paddingBottom: "10px",
                    borderBottom: `1px solid ${theme.color}`,
               },
          },
          children: [
               I({
                    className: "fas fa-check",
                    style: {
                         fontSize: "2em",
                         color: theme.color,
                    },
               }),
               EmptyBox({ height: "10px" }),
               P({
                    text: "Woops !",
               }),
               P({
                    text: "You reached the end !",
               }),
               EmptyBox({ height: "10px" }),
          ],
     });
};
