import {
     BorderSpinner,
     Button,
     Column,
     EmptyBox,
     H3,
     P,
     Row,
} from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import CreatePostView from "../components/CreatePostView";
import PostView from "../components/PostView";
import FollowReferenceModel from "../models/FollowReferenceModel";
import PostModel from "../models/PostModel";
import { GetFollowingOnce, GetPostsOnce } from "../services/DataService";
import FeedEndView from "../static/FeedEndView";

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
               feed.isLoading = false;
               feed.list = _feed;
               setFeed(feed);
               setNumber(10);
          });
     }

     const [theme] = getState("current-theme");
     const [user] = getState("current-user");
     const [feed, setFeed] = getState(`feed-${user.uid}`);
     const [number, setNumber] = setState("displayed-posts-number", 10);

     return Column({
          styleSheet: { className: "home-view", normal: {} },
          children: [
               Row({
                    styleSheet: {
                         className: "sticky-home",
                         normal: {
                              position: "fixed",
                              background: `${theme.secondary}cc`,
                              width: "-webkit-fill-available",
                              backdropFilter: "blur(5px)",
                              alignItems: "center",
                              height: "50px",
                              paddingLeft: "30px",
                         },
                         hover: {
                              background: `${theme.color}44`,
                              cursor: "pointer",
                         },
                    },
                    events: {
                         onClick: () => {
                              scrollTo({ top: 0, behavior: "smooth" });

                              if (!feed.isLoading) {
                                   feed.isLoading = true;
                                   setFeed(feed);

                                   refreshFeed();
                              }
                         },
                    },
                    children: H3({ text: "Home" }),
               }),
               Column({
                    styleSheet: {
                         className: "feed-content",
                         normal: { marginTop: "70px", padding: "0px 20px" },
                    },
                    children: feed.isLoading
                         ? Column({
                                styleSheet: {
                                     className: "feed-content-loading",
                                     normal: {
                                          alignItems: "center",
                                          padding: "30px 0px",
                                     },
                                },
                                children: [
                                     BorderSpinner({ color: theme.color }),
                                     P({
                                          text: "Getting content...",
                                          style: { marginTop: "10px" },
                                     }),
                                ],
                           })
                         : [
                                CreatePostView(),
                                EmptyBox({ height: "20px" }),
                                Column({
                                     styleSheet: {
                                          className: "feed-content-wrapper",
                                          normal: {
                                               paddingBottom: "15px",
                                          },
                                     },
                                     children: [
                                          ...feed.list
                                               .sort((a, b) => b.published - a.published)
                                               .slice(0, number)
                                               .map((post) => {
                                                    return PostView({
                                                         data: post,
                                                         onShared: (shared) => {
                                                              feed.push(shared);
                                                              setNumber(number + 1);
                                                              setFeed(feed);
                                                         },
                                                    });
                                               }),
                                          EmptyBox({ height: "10px" }),
                                          FeedEndView(feed.list, number),
                                          Button({
                                               flags: { renderIf: feed.list.length > number },
                                               text: ["Load More"],
                                               events: {
                                                    onClick: () => setNumber(number + 10),
                                               },
                                               styleSheet: {
                                                    className: "feed-load-more",
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
                           ],
               }),
          ],
     });
};
