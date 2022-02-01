import { Button, Column, I, Img, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import FollowReferenceModel from "../models/FollowReferenceModel";
import UserModel from "../models/UserModel";
import { FollowUnfollow, GetFollowersOnce, GetUserInfo } from "../services/DataService";
import { goToUserPage } from "../Utils";
import PostLoadingView from "./PostLoadingView";

export default (data) => {
     const [currentUser] = getState("current-user");
     const [theme] = getState("current-theme");

     const [user, setUser] = setState(`user-${data.uid}`, UserModel.loadingUser());
     const [isPressed, setIsPressed] = setState(`user-${data.uid}-followers-button`, false);
     const [followers, setFollowers] = setState(`user-${data.uid}-followers`, [], async () => {
          const f = await GetFollowersOnce(data.uid);
          const u = await GetUserInfo(data.uid);

          updateAfter(() => {
               setFollowers(f);
               if (user.uid === UserModel.loadingUser().uid) {
                    setUser(u);
               }
          });
     });

     const isLoading = user.uid === UserModel.loadingUser().uid;
     const isFollowed = followers.find((u) => u.user === currentUser.uid) ? true : false;

     return isLoading
          ? PostLoadingView()
          : Row({
                 styleSheet: {
                      className: "user-card",
                      normal: {
                           padding: "10px 15px",
                           border: `1px solid ${theme.secondaryHover}`,
                           borderRadius: "10px",
                           marginBottom: "10px",
                           alignItems: "center",
                      },
                 },
                 children: [
                      Img({
                           src: data.pic,
                           height: 40,
                           width: 40,
                           style: {
                                borderRadius: "50%",
                                background: theme.secondary,
                                border: `2px solid ${theme.color}`,
                           },
                      }),
                      Column({
                           style: {
                                flex: 1,
                                margin: "0px 10px",
                           },
                           children: [
                                P({
                                     text: "Followed",
                                     flags: { renderIf: isFollowed },
                                     style: { fontWeight: 300, fontSize: "0.8em" },
                                }),
                                P({
                                     text: data.displayName,
                                     style: {
                                          fontWeight: "bold",
                                          cursor: "pointer",
                                          color: theme.color,
                                     },
                                     events: {
                                          onClick: () => {
                                               goToUserPage(data.uid);
                                          },
                                     },
                                }),
                           ],
                      }),
                      Button({
                           flags: {
                                renderIf: currentUser.uid !== data.uid,
                           },
                           text: isPressed
                                ? I({ className: "fas fa-circle-notch fa-spin" })
                                : isFollowed
                                ? "Unfollow"
                                : "Follow",
                           styleSheet: {
                                className: `user-card-${isFollowed ? "unfollow" : "follow"}`,
                                normal: {
                                     margin: "auto",
                                     padding: "5px 20px",
                                     color: isFollowed ? theme.text : theme.color,
                                     border: `1px solid ${theme.color}`,
                                     background: isFollowed ? theme.color : "none",
                                     borderRadius: "10px",
                                },
                                hover: {
                                     background: isFollowed ? theme.danger : theme.color,
                                     borderColor: isFollowed ? theme.secondaryHover : theme.color,
                                     color: theme.text,
                                     cursor: "pointer",
                                },
                           },
                           events: {
                                onClick: () => {
                                     if (!isPressed) {
                                          setIsPressed(true);
                                          FollowUnfollow(currentUser.uid, data.uid, followers).then(
                                               (res) => {
                                                    updateAfter(() => {
                                                         if (res === "followed") {
                                                              followers.push(
                                                                   new FollowReferenceModel(
                                                                        currentUser.uid
                                                                   )
                                                              );
                                                              setFollowers(followers);
                                                         } else {
                                                              setFollowers(
                                                                   followers.filter(
                                                                        (f) =>
                                                                             f.user !==
                                                                             currentUser.uid
                                                                   )
                                                              );
                                                         }

                                                         setIsPressed(false);
                                                    });
                                               }
                                          );
                                     }
                                },
                           },
                      }),
                 ],
            });
};
