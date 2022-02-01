import { Button, Column, I, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import { CreateConversation, FollowUnfollow, GetConversationOnce } from "../services/DataService";
import { encode } from "../Utils";
import ButtonView from "./ButtonView";
import ProfileBannerView from "./ProfileBannerView";
import ProfilePicture from "./ProfilePicture";
import ProfileTopInfosView from "./ProfileTopInfosView";

export default (uid, conv) => {
     const [theme] = getState("current-theme");
     const [currentUser] = getState("current-user");
     const [user] = getState(`user-${uid}`);
     const [followers] = getState(`user-${uid}-followers`);
     const [_, setEdit] = getState("edit-profile");

     const [isPressed, setPressed] = setState(`user-${uid}-followers-button`, false);
     const [isMessaging, setIsMessaging] = setState(`user-${uid}-message-button`, false);
     const isFollowing = followers.find((follow) => follow.user === currentUser.uid) ? true : false;

     const editProfile = () => setEdit(true);

     return Column({
          children: [
               ProfileBannerView(user),
               Row({
                    styleSheet: {
                         className: "user-pic-wrapper",
                         normal: {
                              margin: "-60px 30px 10px 20px",
                              justifyContent: "space-between",
                         },
                    },
                    children: [
                         ProfilePicture(user.pic),
                         Row({
                              children: [
                                   ButtonView({
                                        text: "Edit Profile",
                                        onClick: () => editProfile(),
                                        style: {
                                             margin: "70px 0px auto 5px",
                                        },
                                        renderIf:
                                             currentUser.uid === user.uid &&
                                             !user.isLoading &&
                                             uid === user.uid,
                                   }),
                                   ButtonView({
                                        text: isMessaging
                                             ? I({ className: "fas fa-circle-notch fa-spin" })
                                             : conv
                                             ? "Send a Message"
                                             : "Start conversation",
                                        onClick: () => {
                                             setIsMessaging(true);

                                             (async () => {
                                                  const exists = (
                                                       await GetConversationOnce(
                                                            currentUser.uid,
                                                            user.uid
                                                       )
                                                  ).exists();

                                                  if (exists) {
                                                       goTo(`/messages/@user:${encode(uid)};`);
                                                       setIsMessaging(false);
                                                  } else {
                                                       CreateConversation(currentUser.uid, user.uid)
                                                            .then(() => {
                                                                 updateAfter(() => {
                                                                      const [_, setConv] = getState(
                                                                           `user-${uid}-conv`
                                                                      );

                                                                      setConv(true);
                                                                      setIsMessaging(false);

                                                                      goTo(
                                                                           `/messages/@user:${encode(
                                                                                uid
                                                                           )};`
                                                                      );
                                                                 });
                                                            })
                                                            .catch(() => {
                                                                 console.log(
                                                                      "failed to initiate conversation !"
                                                                 );

                                                                 setIsMessaging(false);
                                                            });
                                                  }
                                             })();
                                        },
                                        style: {
                                             margin: "70px 0px auto 5px",
                                        },
                                        renderIf:
                                             currentUser.uid !== user.uid &&
                                             !user.isLoading &&
                                             uid === user.uid,
                                   }),
                                   ButtonView({
                                        text: isPressed
                                             ? I({ className: "fas fa-circle-notch fa-spin" })
                                             : isFollowing
                                             ? "Unfollow"
                                             : "Follow",
                                        onClick: () => {
                                             if (!isPressed) {
                                                  setPressed(true);
                                                  FollowUnfollow(
                                                       currentUser.uid,
                                                       user.uid,
                                                       followers
                                                  ).then(() => {
                                                       updateAfter(() => {
                                                            setPressed(false);
                                                       });
                                                  });
                                             }
                                        },
                                        style: {
                                             margin: "70px 0px auto 5px",
                                        },
                                        renderIf:
                                             currentUser.uid !== user.uid &&
                                             !user.isLoading &&
                                             uid === user.uid,
                                   }),
                              ],
                         }),
                    ],
               }),
               ProfileTopInfosView(user.uid),
               Row({
                    children: [],
                    style: {
                         padding: "10px 20px",
                         background: theme.secondary,
                         marginTop: "10px",
                         fontSize: "1.25em",
                    },
               }),
          ],
     });
};
