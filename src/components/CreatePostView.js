import {
     Button,
     Column,
     Div,
     EmptyBox,
     H3,
     Img,
     TextArea,
} from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import PostModel from "../models/PostModel";
import { PublishPost, UploadAsset } from "../services/DataService";
import { browseFile, encode } from "../Utils";
import ActionButton from "./ActionButton";
import AlertText from "./AlertText";
import LoadingScreen from "./LoadingScreen";

export default () => {
     const [content, setContent] = setState("create-post-content", "");
     const [img, setImage] = setState("create-post-img", { file: {}, url: "" });
     const [alert, setAlert] = setState("create-post-alert", "");
     const [loading, setLoading] = setState("create-post-loading", false);
     const [theme] = getState("current-theme");

     const maxLength = 300;

     return Column({
          styleSheet: {
               className: "create-post-view",
               normal: {
                    padding: "15px 25px",
                    border: `1px solid ${theme.secondaryHover}`,
                    borderRadius: "10px",
               },
          },
          children: [
               LoadingScreen(loading),
               H3({ text: "Post Note" }),
               TextArea({
                    value: content,
                    maxLength,
                    placeholder: `What's new ?`,
                    styleSheet: {
                         className: "create-post-input",
                         normal: {
                              marginTop: "10px",
                              resize: "none",
                              height: "5em",
                              padding: "10px",
                              borderColor: theme.secondaryHover,
                              color: "inherit",
                              borderRadius: "5px",
                              background: "transparent",
                              font: "inherit",
                         },
                         focus: {
                              outline: `2px solid ${theme.color}`,
                         },
                    },
                    events: {
                         onChange: (e) => {
                              setContent(e.target.value);
                         },
                    },
               }),
               Img({
                    flags: { renderIf: img.url !== "" },
                    src: img.url,
                    style: {
                         marginTop: "10px",
                         width: "auto",
                         borderRadius: "10px",
                    },
                    events: {
                         onDoubleClick: () => {
                              setImage({ url: "", file: {} });
                         },
                    },
               }),
               EmptyBox({ height: "10px" }),
               ActionButton(
                    img.url ? "Change Image (Double Click the image to remove)" : "Add Image",
                    false,
                    () => {
                         browseFile((file) => {
                              updateAfter(() => {
                                   setImage({ url: URL.createObjectURL(file), file });
                              });
                         });
                    }
               ),
               Button({
                    text: "Create",
                    styleSheet: {
                         className: "create-post-button",
                         normal: {
                              color: theme.color,
                              background: "none",
                              marginLeft: "auto",
                              border: `1px solid ${theme.color}`,
                              padding: "10px 20px",
                              marginTop: "10px",
                              borderRadius: "5px",
                         },
                         hover: {
                              background: theme.color,
                              color: theme.textContrast,
                              cursor: "pointer",
                         },
                    },
                    events: {
                         onClick: () => {
                              if (content.length < 10 || content.length > maxLength) {
                                   setAlert("Text is too short ! Write Something !");
                                   return;
                              }

                              const [user] = getState("current-user");
                              if (user.isLoading) return;

                              setLoading(true);

                              (async () => {
                                   const newPost = new PostModel(user.uid, content, "");

                                   if (img.url !== "") {
                                        const imgURL = await UploadAsset(
                                             `${encode(newPost.owner.toString())}-${encode(
                                                  newPost.published.toString()
                                             )}-img`,
                                             img.file
                                        );
                                        newPost.img = imgURL;
                                   }

                                   PublishPost(newPost).then(() => {
                                        updateAfter(() => {
                                             const [feed, setFeed] = getState(`feed-${user.uid}`);

                                             feed.list.push(newPost);

                                             setFeed(feed);
                                             setContent("");
                                             setImage({ url: "", file: {} });
                                             setLoading(false);
                                        });
                                   });
                              })();
                         },
                    },
               }),
               AlertText(alert),
          ],
     });
};
