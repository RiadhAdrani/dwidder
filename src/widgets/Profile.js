import { Button, Column } from "@riadh-adrani/recursive/Recursive-Components";
import { getParams, setTitle } from "@riadh-adrani/recursive/Recursive-Router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import PostView from "../components/PostView";
import { decode } from "../Utils";
import EditProfile from "./EditProfile";
import ProfileTopView from "../components/ProfileTopView";
import ProfileTopLoadingView from "../components/ProfileTopLoadingView";
import FeedEndView from "../static/FeedEndView";
import UserModel from "../models/UserModel";
import {
     GetConversationOnce,
     GetFollowersOnce,
     GetFollowingOnce,
     GetPostsOnce,
     GetUserInfo,
} from "../services/DataService";
import PostModel from "../models/PostModel";

export default () => {
     const [theme] = getState("current-theme");
     const [current] = getState("current-user");

     const uid = decode(getParams().username);
     const [edit] = setState("edit-profile", false);
     const email = decode(getParams().username);
     const [count, setCount] = setState("profile-post-count", 10);
     const [_, setFollowers] = setState(`user-${uid}-followers`, []);
     const [__, setFollowing] = setState(`user-${uid}-following`, []);
     const [conv, setConv] = setState(`user-${uid}-conv`, false);
     const [user, setUser] = setState(`user-${uid}`, UserModel.loadingUser());
     const [posts, setPosts] = setState(`user-${uid}-posts`, [], async () => {
          if (uid !== UserModel.loadingUser().uid)
               await Promise.all([
                    GetUserInfo(uid),
                    GetPostsOnce(uid),
                    GetFollowersOnce(uid),
                    GetFollowingOnce(uid),
                    GetConversationOnce(current.uid, uid),
               ]).then((res) => {
                    updateAfter(() => {
                         setConv(res[4].exists());
                         setUser(UserModel.fromData(res[0].data()));
                         setPosts(res[1].map((p) => PostModel.fromData(p)));
                         setFollowers(res[2]);
                         setFollowing(res[3]);
                    });
               });
     });

     setTitle(user.displayName);

     return Column({
          children:
               user.isLoading || user.uid !== email
                    ? ProfileTopLoadingView()
                    : [
                           ProfileTopView(uid, conv),
                           Column({
                                styleSheet: {
                                     className: "feed-wrapper",
                                     normal: { padding: "10px" },
                                },
                                children: [
                                     ...posts
                                          .sort((a, b) => b.published - a.published)
                                          .slice(0, count)
                                          .map((p) =>
                                               PostView({
                                                    data: p,
                                               })
                                          ),
                                     FeedEndView([], count),
                                     Button({
                                          flags: { renderIf: [].length > count },
                                          text: ["Load More"],
                                          events: {
                                               onClick: () => setCount(count + 10),
                                          },
                                          styleSheet: {
                                               className: "user-posts-load-more",
                                               normal: {
                                                    padding: "5px",
                                                    background: theme.color,
                                                    color: "inherit",
                                                    font: "inherit",
                                                    border: "none",
                                                    borderRadius: "5px",
                                               },
                                               hover: {
                                                    background: `${theme.color}aa`,
                                                    cursor: "pointer",
                                               },
                                               active: {
                                                    transform: "scale(0.975)",
                                               },
                                          },
                                     }),
                                ],
                           }),
                           edit ? EditProfile(user) : "",
                      ],
     });
};
