import { P, I, Column, BorderSpinner } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import { LikeUnlike, Share, WatchInteraction } from "../services/DataService";
import { setCollectionState } from "../utils/LiveState";

export default ({ type, post }) => {
     const uid = `post-${post.owner}-${post.published}-${type}`;

     const [theme] = getState("current-theme");
     const [user] = getState("current-user");
     const [loading, setLoading] = setState(`${uid}-loading`, true);

     const [get, set, live] = setCollectionState(
          uid,
          `users/${post.owner}/posts/${post.published}/${type}s`,
          () => {
               setLoading(false);
          },
          () => {
               setLoading(false);
          },
          () => {},
          (item) => {
               set(live().filter((like) => like.user !== item.user));
               setLoading(false);
          }
     );

     const userIn = get.find((i) => i.user === user.uid) ? true : false;

     const actionColor = (() => {
          switch (type) {
               case "like":
                    return userIn ? theme.liked : theme.text;
               case "comment":
                    return userIn ? theme.commented : theme.text;
               case "share":
                    return userIn ? theme.shared : theme.text;
          }
     })();

     const action = (() => {
          switch (type) {
               case "like":
                    return () => {
                         setLoading(true);
                         LikeUnlike(user.uid, post, get);
                    };
               case "comment":
                    return () => {
                         const [show, setShow] = getState(
                              `post-${post.published}-${post.owner}-show-comments`
                         );
                         setShow(!show);
                    };
               case "share":
                    return () => {
                         const [show, setShow] = getState(
                              `post-${post.published}-${post.owner}-show-share`
                         );
                         setShow(!show);
                    };
          }
     })();

     const icon = (() => {
          switch (type) {
               case "like":
                    return userIn ? "fas fa-heart" : "far fa-heart";
               case "comment":
                    return userIn ? "fas fa-comment" : "far fa-comment";
               case "share":
                    return "fas fa-retweet";
               default:
          }
     })();

     return P({
          styleSheet: {
               className: "post-action",
               normal: {
                    padding: "10px",
                    borderRadius: "5px",
               },
               hover: {
                    backgroundColor: theme.secondaryHover,
                    cursor: "pointer",
               },
          },
          style: { color: actionColor },
          text: [
               I({
                    className: loading ? "fas fa-circle-notch fa-spin" : icon,
               }),
               " ",
               get.length,
          ],
          events: {
               onClick: () => {
                    if (!loading) {
                         action();
                    }
               },
          },
     });
};
