import { Column, H4, I, Img, P, Row, Span } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import CommentModel from "../models/CommentModel";
import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import { AddComment, GetComments, GetPost, GetUserInfo, SharePost } from "../services/DataService";
import { goToUserPage, since } from "../Utils";
import ActionButton from "./ActionButton";
import CommentView from "./CommentView";
import NewCommentButtonView from "./NewCommentButtonView";
import NewCommentInputView from "./NewCommentInputView";
import PostActionView from "./PostActionView";
import PostLoadingView from "./PostLoadingView";
import PostSnipperView from "./PostSnipperView";

export default ({ data }) => {
     const uid = `post-${data.published}-${data.owner}`;

     const [theme] = getState("current-theme");
     const [user] = getState("current-user");
     const [owner, setOwner] = setState(`user-${data.owner}`, UserModel.loadingUser(), () => {
          GetUserInfo(data.owner).then((doc) => setOwner(UserModel.fromData(doc.data())));
     });

     const [commenting, setCommenting] = setState(`${uid}-commenting`, false);
     const [showComments] = setState(`${uid}-show-comments`, false);
     const [comments, setComments] = setState(`${uid}-comments`, [], () => {
          GetComments(data.owner, data.published).then((list) => {
               updateAfter(() => {
                    setComments(list);
               });
          });
     });
     const [newComment, setNewComment] = setState(`${uid}-new-comment`, "");

     const [sharing, setSharing] = setState(`${uid}-sharing`, false);
     const [shareText, setShareText] = setState(`${uid}-share-text`);
     const [showShare] = setState(`${uid}-show-share`, false);

     return owner.isLoading
          ? PostLoadingView()
          : Row({
                 styleSheet: {
                      className: "post-view",
                      normal: {
                           padding: "20px 20px 10px 20px",
                           border: `1px solid ${theme.text}22`,
                           borderRadius: "20px",
                           marginBottom: "10px",
                      },
                 },
                 children: [
                      Img({
                           src: owner.pic,
                           height: "50",
                           width: "50",
                           styleSheet: {
                                className: "post-owner-pic",
                                normal: { borderRadius: "50%", marginTop: "5px" },
                           },
                      }),
                      Column({
                           styleSheet: {
                                className: "post-info-wrapper",
                                normal: {
                                     marginLeft: "10px",
                                     width: "85%",
                                },
                           },
                           children: [
                                H4({
                                     style: { color: theme.color, cursor: "pointer" },
                                     events: {
                                          onClick: () => goToUserPage(data.owner),
                                     },
                                     text: [
                                          I({
                                               flags: { renderIf: data.original !== true },
                                               className: "fas fa-retweet",
                                               style: { color: theme.text, marginRight: "5px" },
                                          }),
                                          owner.displayName,
                                          Span({
                                               text: ` ${since(data.published)} ago`,
                                               style: {
                                                    fontWeight: "300",
                                                    color: theme.text,
                                                    fontSize: "0.8em",
                                               },
                                          }),
                                     ],
                                }),
                                P({
                                     text: data.text,
                                     styleSheet: {
                                          className: "post-text",
                                          normal: { whiteSpace: "break-spaces", margin: "7px 0px" },
                                     },
                                }),
                                Img({
                                     flags: { renderIf: data.img !== "" },
                                     src: data.img,
                                     alt: `the text says ${data.text}`,
                                     styleSheet: {
                                          className: "post-img",
                                          normal: {
                                               width: "95%",
                                               marginTop: "10px",
                                               borderRadius: "10px",
                                          },
                                     },
                                }),
                                data.original !== true
                                     ? PostSnipperView(data.original.from, data.original.published)
                                     : "",
                                Row({
                                     styleSheet: {
                                          className: "post-actions",
                                          normal: {
                                               justifyContent: "space-evenly",
                                               marginTop: "5px",
                                          },
                                     },
                                     children: [
                                          PostActionView({
                                               type: "like",
                                               post: data,
                                          }),
                                          PostActionView({
                                               type: "comment",
                                               post: data,
                                          }),
                                          PostActionView({
                                               type: "share",
                                               post: data,
                                          }),
                                          P({
                                               flags: { renderIf: data.owner === user.uid },
                                               className: "post-action",
                                               text: [I({ className: "far fa-edit" })],
                                          }),
                                     ],
                                }),
                                Column({
                                     flags: { renderIf: showShare === true },
                                     children: [
                                          Row({
                                               style: { marginBottom: "10px" },
                                               children: [
                                                    NewCommentInputView(sharing, shareText, (e) => {
                                                         if (!sharing) setShareText(e.target.value);
                                                    }),
                                                    ActionButton("Share", sharing, () => {
                                                         if (!sharing) {
                                                              setSharing(true);

                                                              if (data.original === true) {
                                                                   SharePost(
                                                                        user.uid,
                                                                        data,
                                                                        shareText
                                                                             ? shareText.trim()
                                                                             : ""
                                                                   ).then(() => {
                                                                        updateAfter(() => {
                                                                             setSharing(false);
                                                                             setShareText("");
                                                                        });
                                                                   });
                                                              } else {
                                                                   (async () => {
                                                                        const original =
                                                                             await GetPost(
                                                                                  data.original
                                                                                       .from,
                                                                                  data.original
                                                                                       .published
                                                                             );
                                                                        SharePost(
                                                                             user.uid,
                                                                             PostModel.fromData(
                                                                                  original
                                                                             ),
                                                                             shareText
                                                                                  ? shareText.trim()
                                                                                  : ""
                                                                        ).then(() => {
                                                                             updateAfter(() => {
                                                                                  setSharing(false);
                                                                                  setShareText("");
                                                                             });
                                                                        });
                                                                   })();
                                                              }
                                                         }
                                                    }),
                                               ],
                                          }),
                                     ],
                                }),
                                // comments
                                Column({
                                     flags: { renderIf: showComments === true },
                                     children: [
                                          Row({
                                               style: { marginBottom: "10px" },
                                               children: [
                                                    NewCommentInputView(
                                                         commenting,
                                                         newComment,
                                                         (e) => {
                                                              if (!commenting)
                                                                   setNewComment(e.target.value);
                                                         }
                                                    ),
                                                    NewCommentButtonView(commenting, () => {
                                                         if (!commenting) {
                                                              setCommenting(true);

                                                              const [user] =
                                                                   getState("current-user");

                                                              const _new = new CommentModel(
                                                                   user.uid,
                                                                   Date.now(),
                                                                   Date.now(),
                                                                   newComment
                                                              );

                                                              AddComment(
                                                                   user.uid,
                                                                   PostModel.fromData(data),
                                                                   _new
                                                              ).then(() => {
                                                                   updateAfter(() => {
                                                                        setComments([
                                                                             ...comments,
                                                                             _new,
                                                                        ]);
                                                                        setCommenting(false);
                                                                        setNewComment("");
                                                                   });
                                                              });
                                                         }
                                                    }),
                                               ],
                                          }),
                                          Column({
                                               children: comments
                                                    .sort((a, b) => b.date - a.date)
                                                    .map((comment) => CommentView(comment)),
                                          }),
                                     ],
                                }),
                           ],
                      }),
                 ],
            });
};
