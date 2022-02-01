import { B, Column, H1, I, P, Row, Span } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import { since } from "../Utils";

export default (uid) => {
     const [user] = getState(`user-${uid}`);
     const [followers] = getState(`user-${uid}-followers`);
     const [following] = getState(`user-${uid}-following`);

     return Column({
          styleSheet: {
               className: "user-info-wrapper",
               normal: {
                    padding: "0px 25px",
               },
          },
          children: [
               H1({
                    text: [user.displayName],
                    styleSheet: {
                         className: "user-display-name",
                         normal: { fontSize: "1.5em" },
                    },
               }),
               P({ text: user.about, style: { whiteSpace: "break-spaces" } }),
               P({
                    style: { margin: "10px 0px" },
                    text: [
                         I({ className: "fas fa-calendar-alt" }),
                         " ",
                         Span({
                              text: `Joined ${new Date(user.joined).toLocaleDateString()} (${since(
                                   user.joined
                              )} ago)`,
                         }),
                    ],
               }),
               Row({
                    children: [
                         P({
                              text: [B({ children: following.length }), " Following"],
                              style: { marginRight: "10px" },
                         }),
                         P({
                              text: [B({ children: followers.length }), " Followers"],
                         }),
                    ],
               }),
          ],
     });
};
