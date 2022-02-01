import { Column, H4, Img, P, Row, Span } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import { GetPost, GetUserInfo } from "../services/DataService";
import { goToUserPage, since } from "../Utils";
import PostLoadingView from "./PostLoadingView";

export default (author, published) => {
     const [theme] = getState("current-theme");

     const [post, setPost] = setState(`post-${published}-${author}`, PostModel.loading(), () => {
          GetPost(author, published).then((data) => setPost(PostModel.fromData(data)));
     });
     const [owner, setOwner] = setState(`user-${author}`, UserModel.loadingUser(), () => {
          GetUserInfo(author).then((doc) => {
               setOwner(UserModel.fromData(doc.data()));
          });
     });

     return owner.isLoading || post.isLoading
          ? PostLoadingView()
          : Row({
                 styleSheet: {
                      className: "post-snippet-view",
                      normal: {
                           padding: "10px",
                           border: `1px solid ${theme.text}22`,
                           borderRadius: "20px",
                           margin: "10px 0px",
                           fontSize: "0.9em",
                      },
                 },
                 children: [
                      Img({
                           src: owner.pic,
                           height: 35,
                           width: 35,
                           styleSheet: {
                                className: "post-snippet-author",
                                normal: {
                                     borderRadius: "50%",
                                     marginTop: "5px",
                                     marginRight: "10px",
                                },
                           },
                      }),
                      Column({
                           children: [
                                H4({
                                     events: { onClick: () => goToUserPage(author) },
                                     style: { cursor: "pointer" },
                                     text: [
                                          owner.displayName,
                                          Span({
                                               text: ` ${since(post.published)} ago`,
                                               style: {
                                                    fontWeight: "300",
                                                    color: theme.text,
                                                    fontSize: "0.8em",
                                               },
                                          }),
                                     ],
                                }),
                                P({
                                     text: post.text,
                                     styleSheet: {
                                          className: "post-snippet-content",
                                          normal: { whiteSpace: "break-spaces" },
                                     },
                                }),
                                Img({
                                     flags: { renderIf: post.img !== "" },
                                     src: post.img,
                                     alt: `the text says : ${post.text}`,
                                     styleSheet: {
                                          className: "post-img",
                                          normal: {
                                               width: "95%",
                                               margin: "10px 0px",
                                               borderRadius: "10px",
                                          },
                                     },
                                }),
                           ],
                      }),
                 ],
            });
};
