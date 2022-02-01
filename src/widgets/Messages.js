import { Column, EmptyBox, I, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getParams, setTitle } from "@riadh-adrani/recursive/Recursive-Router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import ActionButton from "../components/ActionButton";
import ConversationCard from "../components/ConversationCard";
import FixedTitle from "../components/FixedTitle";
import MessageOtherView from "../components/MessageOtherView";
import MessageOwnView from "../components/MessageOwnView";
import MessageUserIcon from "../components/MessageUserIcon";
import NewCommentInputView from "../components/NewCommentInputView";
import { sendMessage } from "../db/Firebase";
import MessageModel from "../models/MessageModel";
import UserModel from "../models/UserModel";
import {
     GetConversationOnce,
     GetFollowingOnce,
     GetUserInfo,
     WatchConversations,
     WatchMessages,
} from "../services/DataService";
import { decode, since } from "../Utils";

export default () => {
     const [user] = getState("current-user");
     const [theme] = getState("current-theme");
     const params = getParams();

     const [usersToMessage, setUsersToMessage] = setState(`users-to-message`, [], async () => {
          const following = await GetFollowingOnce(user.uid);
          setUsersToMessage(following.map((doc) => doc.user));
     });

     const [message, setMessage] = setState("message", "");

     const [user2, setUser2] = setState(`user-${params.username}`, UserModel.loadingUser(), () => {
          if (params.username) {
               GetUserInfo(decode(params.username)).then((res) => {
                    setUser2(UserModel.fromData(res.data()));
               });
          }
     });
     const [covnersation, setConversation] = setState(
          `conversation-with-${params.username}`,
          {},
          () => {
               if (params.username) {
                    GetConversationOnce(user.uid, decode(params.username)).then((res) => {
                         setConversation(res.data());
                    });
               }
          }
     );
     const [messages, setMessages, pre, exists, liveMessages] = setState(
          `user-${decode(params.username ? params.username : "")}-messages`,
          []
     );
     const [watcher, setWatcher, preWatcher, watcherExists, unsub] = setState(
          `user-${decode(params.username ? params.username : "")}-messages-watcher`,
          () => {},
          async () => {
               if (params.username) {
                    const unsubscribe = WatchMessages(
                         user.uid,
                         decode(params.username),
                         (items) => {
                              updateAfter(() => {
                                   setWatcher(unsubscribe);
                                   setMessages(items.map((msg) => MessageModel.fromData(msg)));
                              });
                         },
                         (item) => {
                              updateAfter(() => {
                                   setMessages([...liveMessages(), MessageModel.fromData(item)]);
                              });
                         },
                         () => {},
                         () => {}
                    );
               }
          },
          () => {
               unsub()();
          }
     );

     const [msgDisplayed, setMsgDisplayed] = setState(`user-${params.username}-displayed-msgs`, 5);

     const [hub, setHub, preHub, hubExists, hubLive] = setState(
          `user-${user.uid}-conversations`,
          []
     );

     const [convWatcher, setConvWatcher, preConvWatcher, convWatcherExists, convUnsub] = setState(
          `user-${user.uid}-conversations-watcher`,
          () => {},
          async () => {
               const unsubscribe = WatchConversations(
                    user.uid,
                    (items) => {
                         updateAfter(() => {
                              setConvWatcher(unsubscribe);
                              setHub(items);
                         });
                    },
                    (item) => {
                         updateAfter(() => {
                              setHub([...hubLive(), item]);
                         });
                    },
                    (item) => {
                         setHub(hubLive().map((conv) => (conv.user !== item.user ? conv : item)));
                    },
                    () => {}
               );
          },
          () => {
               convUnsub()();
          }
     );

     const title = params.username ? user2.displayName : "Messages";
     setTitle(params.username ? user2.displayName : "Messages");

     return Column({
          styleSheet: {
               className: "messages-section",
               normal: {
                    maxHeight: "100vh",
                    minHeight: "100vh",
               },
          },
          children: [
               FixedTitle(title),
               EmptyBox({ height: "50px" }),
               Row({
                    flags: { renderIf: false },
                    styleSheet: {
                         className: "users-list",
                         normal: {
                              padding: "10px 20px",
                              overflowX: "auto",
                              borderBottom: `1px solid ${theme.secondaryHover}55`,
                         },
                         webkitScrollbar: { height: "8px" },
                         webkitScrollbarTrack: {
                              boxShadow: "inset 0 0 2px grey",
                              borderRadius: "5px",
                         },
                         webkitScrollbarThumb: {
                              background: theme.secondaryHover,
                              borderRadius: "5px",
                         },
                         webkitScrollbarThumbHover: {},
                    },
                    children: usersToMessage.map((user) => MessageUserIcon(user)),
               }),
               params.username === undefined
                    ? Column({
                           children: hub
                                .sort((a, b) => {
                                     const aComp = a.latestMessage.date
                                          ? a.latestMessage.date
                                          : a.started.date;
                                     const bComp = b.latestMessage.date
                                          ? b.latestMessage.date
                                          : b.started.date;

                                     return bComp - aComp;
                                })
                                .map((conv) => ConversationCard(conv)),
                      })
                    : Column({
                           style: { flex: 1 },
                           children: [
                                Column({
                                     styleSheet: {
                                          className: "inbox-window",
                                          normal: {
                                               flex: "1 1 0",
                                               padding: "20px 10px",
                                               overflowY: "auto",
                                          },
                                          webkitScrollbar: { height: "8px", width: "10px" },
                                          webkitScrollbarTrack: {
                                               boxShadow: "inset 0 0 2px grey",
                                               borderRadius: "5px",
                                          },
                                          webkitScrollbarThumb: {
                                               background: theme.secondaryHover,
                                               borderRadius: "5px",
                                          },
                                          webkitScrollbarThumbHover: {},
                                     },
                                     children: [
                                          !covnersation.started
                                               ? ""
                                               : P({
                                                      style: {
                                                           marginTop: "auto",
                                                           fontSize: "0.8em",
                                                           textAlign: "center",
                                                           color: `${theme.text}cc`,
                                                           marginBottom: "20px",
                                                      },
                                                      text: `${(() => {
                                                           if (user.uid === covnersation.started.by)
                                                                return user.displayName;
                                                           else return user2.displayName;
                                                      })()} started this conversation ${since(
                                                           covnersation.started.date
                                                      )} ago`,
                                                 }),
                                          messages.length <= msgDisplayed
                                               ? ""
                                               : ActionButton("Load more messages", false, () => {
                                                      if (messages.length > msgDisplayed) {
                                                           setMsgDisplayed(msgDisplayed + 20);
                                                      }
                                                 }),
                                          ...messages
                                               .sort((a, b) => a.date - b.date)
                                               .slice(0, msgDisplayed)
                                               .map((msg) =>
                                                    msg.user === user.uid
                                                         ? MessageOwnView(msg)
                                                         : MessageOtherView(msg)
                                               ),
                                     ],
                                }),
                                Row({
                                     styleSheet: {
                                          className: "input-wrapper",
                                          normal: { padding: "5px 10px" },
                                     },
                                     children: [
                                          NewCommentInputView(false, message, (e) => {
                                               setMessage(e.target.value);
                                          }),
                                          ActionButton(
                                               I({ className: "fas fa-paper-plane" }),
                                               false,
                                               () => {
                                                    if (message.trim() && params.username) {
                                                         setMessage("");
                                                         sendMessage(
                                                              new MessageModel(
                                                                   user.uid,
                                                                   message,
                                                                   Date.now(),
                                                                   false
                                                              ),
                                                              decode(params.username)
                                                         );
                                                    }
                                               }
                                          ),
                                     ],
                                }),
                           ],
                      }),
          ],
     });
};
