import { Column, Img, P, Row, Span } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import UserModel from "../models/UserModel";
import { GetUserInfo } from "../services/DataService";
import { goToUserPage, since } from "../Utils";
import CommentLoadingView from "./CommentLoadingView";

export default (comment) => {
     const [theme] = getState("current-theme");
     const [owner, setOwner] = setState(`user-${comment.user}`, UserModel.loadingUser(), () => {
          GetUserInfo(comment.user).then((doc) => {
               setOwner(UserModel.fromData(doc.data()));
          });
     });

     return owner.loading
          ? CommentLoadingView()
          : Row({
                 styleSheet: {
                      className: "comment-view",
                      normal: {
                           padding: "10px",
                           borderRadius: "10px",
                           border: `1px solid ${theme.secondaryHover}`,
                           marginBottom: "5px",
                      },
                 },
                 children: [
                      Img({
                           src: owner.pic,
                           height: 40,
                           width: 40,
                           style: { marginRight: "10px", borderRadius: "50%" },
                      }),
                      Column({
                           style: {
                                flex: 1,
                           },
                           children: [
                                P({
                                     style: { marginBottom: "5px", cursor: "pointer" },
                                     text: [
                                          Span({
                                               text: owner.displayName,
                                               style: {
                                                    fontWeight: "bold",
                                                    marginRight: "10px",
                                               },
                                          }),
                                          Span({
                                               text: `${since(comment.date)} ago`,
                                               style: { fontWeight: 300, fontSize: "0.7em" },
                                          }),
                                     ],
                                     events: {
                                          onClick: () => {
                                               goToUserPage(owner.uid);
                                          },
                                     },
                                }),
                                P({ text: comment.text }),
                           ],
                      }),
                 ],
            });
};
