import { Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import Profile from "./widgets/Profile";
import { createRoute, createRouter, renderRouter } from "@riadh-adrani/recursive/Recursive-Router";
import Template from "./widgets/Template";
import Feed from "./widgets/Feed";
import Settings from "./widgets/Settings";
import Login from "./widgets/Login";
import Signup from "./widgets/Signup";
import EditProfile from "./widgets/EditProfile";
import { GetTheme } from "./Colors";
import UserModel from "./models/UserModel";
import FollowReferenceModel from "./models/FollowReferenceModel";
import { GetFollowingOnce, GetPostsOnce } from "./services/DataService";
import PostModel from "./models/PostModel";
import Messages from "./widgets/Messages";

createRouter(
     createRoute({
          name: "/",
          component: () => Template(Feed()),
          title: "Home",
          onLoad: () => {},
          subRoutes: [
               createRoute({
                    name: "/login",
                    title: "Login",
                    component: () => Login(),
                    onLoad: () => {},
               }),
               createRoute({
                    name: "/signup",
                    title: "Sign Up",
                    component: () => Signup(),
                    onLoad: () => {},
               }),
               createRoute({
                    name: "/messages",
                    title: "Messages",
                    component: () => Template(Messages()),
               }),
               createRoute({
                    name: "/messages/@user:username;",
                    title: "Conversation",
                    component: () => Template(Messages()),
               }),
               createRoute({
                    name: "/user@:username;",
                    title: "Profile",
                    component: () => Template(Profile()),
               }),
               createRoute({
                    name: "/edit",
                    title: "Edit Profile",
                    component: () => Template(EditProfile()),
               }),
               createRoute({
                    name: "/settings",
                    title: "Settings",
                    component: () => Template(Settings()),
               }),
          ],
     })
);

export default () => {
     async function refreshFeed() {
          const listOfFollowing = (await GetFollowingOnce(user.uid)).map((f) =>
               FollowReferenceModel.fromData(f)
          );
          listOfFollowing.push(new FollowReferenceModel(user.uid));

          const _feed = [];

          for (const follow of listOfFollowing) {
               const res = await GetPostsOnce(follow.user);
               _feed.push(...res.map((post) => PostModel.fromData(post)));
          }

          updateAfter(() => {
               feed.list = _feed;
               feed.isLoading = false;

               setFeed(feed);
          });
     }

     const [user] = setState("current-user", UserModel.loadingUser());
     const [theme] = setState("current-theme", GetTheme(document.cookie));
     const [feed, setFeed] = setState(`feed-${user.uid}`, { list: [], isLoading: true }, () =>
          refreshFeed()
     );

     return Row({
          styleSheet: {
               className: "app",
               normal: {
                    minHeight: "100vh",
                    background: theme.main,
                    color: theme.text,
               },
          },
          children: renderRouter(),
     });
};
