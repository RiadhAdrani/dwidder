import { setState } from "@riadh-adrani/recursive/Recursive-State";
import { updateDoc } from "firebase/firestore";
import {
     createConversation,
     createPost,
     createUser,
     followUser,
     getComments,
     getConversation,
     getPost,
     getUser,
     getUserDataList,
     getUsers,
     likePost,
     postComment,
     sendMessage,
     sharePost,
     signIn,
     signUp,
     unfollowUser,
     unlikePost,
     updateUser,
     uploadAsset,
     watchFollowers,
     watchFollowing,
     watchInteraction,
     watchItems,
     watchPosts,
} from "../db/Firebase";
import UserModel from "../models/UserModel";

const SignUpAndLogin = async (email, password, displayName) => {
     return signUp(email, password)
          .then(() => createUser(email, displayName))
          .then(() => signIn(email, password))
          .then(() => getUser(email));
};

const Login = async (email, password) => signIn(email, password).then(() => getUser(email));

const GetFeed = async ({ email, onAdded, onModified, onDeleted, onLoaded }) => {
     return watchFollowing(
          email,
          (list) => onLoaded(list),
          (change) => onAdded(change),
          (change) => onModified(change),
          (change) => onDeleted(change)
     );
};

const GetSearchResult = async (searchQuery) => {
     const users = (await getUsers()).docs
          .map((user) => UserModel.fromData(user.data()))
          .filter((user) => user.displayName.toLowerCase().includes(searchQuery));

     for (let user in users) {
          const followers = await GetFollowersOnce(user.uid);
          users[user].followers = followers;
     }

     return users;
};

const GetFollowers = async ({ email, onAdded, onModified, onDeleted, onLoaded }) => {
     watchFollowers(email, onLoaded, onAdded, onModified, onDeleted);
};

const GetFollowersDataStream = (email) => {
     const [get, set] = setState(`user-${email}-followers`, []);
     const [done, setDone] = setState(`user-${email}-followers-retrieved`, false);

     if (!done) {
          watchFollowers(
               email,
               (list) => {
                    console.log(list);
                    setDone(true);
                    set(list);
               },
               (item) => {
                    console.log(item);
               },
               (item) => {},
               (item) => {}
          );
     }

     return [get, set];
};

const PublishPost = (post) => createPost(post.owner, post);

const watchUserPosts = (user, onLoaded, onAdded, onModified, onDeleted) =>
     watchItems(`users/${user}/posts`, onLoaded, onAdded, onModified, onDeleted);

const GetUserInfo = (user) => getUser(user);

const WatchInteraction = (post, type, onLoaded, onAdded, onModified, onDeleted) => {
     return watchItems(
          `users/${post.owner}/posts/${post.published}/${type}s/`,
          onLoaded,
          onAdded,
          onModified,
          onDeleted
     );
};

const LikeUnlike = (user, post, likes) => {
     if (likes.find((l) => l.user === user)) {
          unlikePost(user, post);
     } else {
          likePost(user, post);
     }
};

const Share = (user, post) => {
     sharePost(user, post, "");
};

const UpdateUser = (uid, data) => updateUser(uid, data);

const UploadAsset = (name, file) => uploadAsset(name, file);

const GetFollowersOnce = (uid) => getUserDataList(uid, "followers");

const GetFollowingOnce = (uid) => getUserDataList(uid, "following");

const GetPostsOnce = (uid) => getUserDataList(uid, "posts");

const FollowUnfollow = async (userUID, targetUserUID, targetFollowers) => {
     if (targetFollowers.find((follow) => follow.user === userUID) !== undefined) {
          return unfollowUser(userUID, targetUserUID);
     } else {
          return followUser(userUID, targetUserUID);
     }
};

const GetComments = (uid, published) => getComments(uid, published);

const AddComment = (user, post, comment) => postComment(user, post, comment);

const GetPost = (user, published) => getPost(user, published);

const SharePost = (user, post, text) => sharePost(user, post, text);

const GetConversationOnce = (user, targetUser) => getConversation(user, targetUser);

const CreateConversation = (user1, user2) => createConversation(user1, user2);

const WatchMessages = (user, target, onLoaded, onAdded, onModified, onRemoved) =>
     watchItems(
          `users/${user}/messages/hub/conversations/${target}/messages`,
          onLoaded,
          onAdded,
          onModified,
          onRemoved
     );

const WatchConversations = (user, onLoaded, onAdded, onModified, onRemoved) =>
     watchItems(
          `users/${user}/messages/hub/conversations`,
          onLoaded,
          onAdded,
          onModified,
          onRemoved
     );

const SendMessage = (message, target) => sendMessage(message, target);

export {
     SignUpAndLogin,
     Login,
     GetFeed,
     GetSearchResult,
     GetFollowers,
     GetFollowersDataStream,
     PublishPost,
     watchUserPosts,
     GetUserInfo,
     WatchInteraction,
     LikeUnlike,
     Share,
     UpdateUser,
     UploadAsset,
     GetFollowersOnce,
     GetFollowingOnce,
     GetPostsOnce,
     FollowUnfollow,
     GetComments,
     AddComment,
     GetPost,
     SharePost,
     GetConversationOnce,
     CreateConversation,
     WatchMessages,
     SendMessage,
     WatchConversations,
};
