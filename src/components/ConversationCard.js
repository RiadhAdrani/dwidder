import { Column, H3, Img, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import UserModel from "../models/UserModel";
import { GetUserInfo } from "../services/DataService";
import { encode, since } from "../Utils";
import PostLoadingView from "./PostLoadingView";

export default (conv) => {
     const [theme] = getState("current-theme");
     const [currentUser] = getState("current-user");

     const [user, setUser] = setState(`user-${conv.user}`, UserModel.loadingUser(), () => {
          GetUserInfo(conv.user).then((doc) => setUser(UserModel.fromData(doc.data())));
     });

     return user.isLoading
          ? PostLoadingView()
          : Row({
                 events: {
                      onClick: () => {
                           goTo(`/messages/@user:${encode(conv.user)};`);
                      },
                 },
                 styleSheet: {
                      className: "conversation-card",
                      normal: {
                           padding: "20px",
                           margin: "10px 15px 0px 15px",
                           border: `1px solid ${theme.secondaryHover}`,
                           borderRadius: "30px",
                           alignItems: "center",
                      },
                      hover: {
                           backgroundColor: theme.secondaryHover,
                           cursor: "pointer",
                      },
                 },
                 children: [
                      Img({
                           src: user.pic,
                           height: 70,
                           width: 70,
                           styleSheet: {
                                className: "conversation-card-img",
                                normal: { borderRadius: "50%", marginRight: "20px" },
                           },
                      }),
                      Column({
                           children: [
                                H3({
                                     text: user.displayName,
                                     styleSheet: {
                                          className: "conversation-card-user",
                                          normal: {
                                               color: theme.color,
                                               padding: "0px",
                                          },
                                     },
                                }),
                                P({
                                     text: `${since(
                                          conv.latestMessage.date
                                               ? conv.latestMessage.date
                                               : conv.started.date
                                     )} ago`,
                                     styleSheet: {
                                          className: "conversation-card-latest-interaction",
                                          normal: {
                                               fontWeight: 300,
                                               fontSize: "0.8em",
                                               color: `${theme.text}99`,
                                          },
                                     },
                                }),
                                P({
                                     text: conv.latestMessage.user
                                          ? `${
                                                 conv.latestMessage.user === currentUser.uid
                                                      ? currentUser.displayName
                                                      : user.displayName
                                            } : ${conv.latestMessage.text}`
                                          : `Created by ${conv.started.by} since ${since(
                                                 conv.started.date
                                            )}`,
                                     styleSheet: {
                                          className: "conversation-card-message",
                                          normal: {
                                               fontWeight: 300,
                                               marginTop: "5px",
                                          },
                                     },
                                }),
                           ],
                      }),
                 ],
            });
};
