import { initializeApp } from "firebase/app";
import {
     collection,
     deleteDoc,
     doc,
     getDoc,
     getDocs,
     getFirestore,
     onSnapshot,
     query,
     setDoc,
     updateDoc,
     where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UserModel from "../models/UserModel";
import FollowReferenceModel from "../models/FollowReferenceModel";
import PostModel from "../models/PostModel";
import LikeInteraction from "../models/LikeModel";
import CommentModel from "../models/CommentModel";
import ShareModel from "../models/ShareModel";

const firebaseConfig = {
     apiKey: "AIzaSyCwErx19D2C0-x2GDt7Mjewsph5NhwZcy0",
     authDomain: "noter-media.firebaseapp.com",
     projectId: "noter-media",
     storageBucket: "noter-media.appspot.com",
     messagingSenderId: "872516723194",
     appId: "1:872516723194:web:e4eacb2c52b8cf117a8443",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const USERS = "users";

const followingRoute = (user, target) => `${user}/following/${target}`;

const followerRoute = (user, target) => `${user}/followers/${target}`;

const followersRoute = (user) => `${user}/followers`;

const followingsRoute = (user) => `${user}/following`;

const postRoute = (user, published) => `${user}/posts/${published}`;

const postsRoute = (user) => `${user}/posts`;

const postInteractionRoute = (post, type) => `${post.owner}/posts/${post.published}/${type}`;

const postVersionRoute = (user, published, version) =>
     `${user}/posts/${published}/versions/${version}`;

const postLikeRoute = (user, published, liker) => `${user}/posts/${published}/likes/${liker}`;

const postCommentRoute = (user, published, commenter, date) =>
     `${user}/posts/${published}/comments/${commenter}-${date}`;

const postCommentsRoute = (post) => `${post.owner}/posts/${post.published}/comments`;

const postCommentVersionRoute = (user, published, commenter, date, version) =>
     `${user}/posts/${published}/comments/${commenter}-${date}/versions/${version}`;

const postShareRoute = (user, published, sharer, date) =>
     `${user}/posts/${published}/shares/${sharer}-${date}`;

const checkPost = (post) => {
     if (post instanceof PostModel === false) {
          throw "Post is not an instance of PostModel";
     }
};

const checkComment = (comment) => {
     if (comment instanceof CommentModel === false) {
          throw "Comment is not an instance of CommentModel";
     }
};

const signUp = (email, password) => {
     return createUserWithEmailAndPassword(auth, email, password);
};

const signIn = (email, password) => {
     return signInWithEmailAndPassword(auth, email, password);
};

const uploadImage = async (name, file) => uploadBytes(ref(storage, name), file);

const getImageURL = async (name) => getDownloadURL(ref(storage, name));

const createUser = async (email, displayName) => {
     return setDoc(doc(db, USERS, email), new UserModel(email, displayName).toJSON());
};

const followUser = async (user, target) => {
     await setDoc(
          doc(db, USERS, followingRoute(user, target)),
          new FollowReferenceModel(target).toJSON()
     );
     await setDoc(
          doc(db, USERS, followerRoute(target, user)),
          new FollowReferenceModel(user).toJSON()
     );

     return "followed";
};

const unfollowUser = async (user, target) => {
     await deleteDoc(doc(db, USERS, followingRoute(user, target)));
     await deleteDoc(doc(db, USERS, followerRoute(target, user)));
     return "unfollowed";
};

const createPost = async (user, post) => {
     checkPost(post);

     return setDoc(doc(db, USERS, postRoute(user, post.published)), post.toJSON());
};

const likePost = async (user, post) => {
     checkPost(post);

     return setDoc(
          doc(db, USERS, postLikeRoute(post.owner, post.published, user)),
          new LikeInteraction(user).toJSON()
     );
};

const unlikePost = async (user, post) => {
     checkPost(post);

     return deleteDoc(doc(db, USERS, postLikeRoute(post.owner, post.published, user)));
};

const postComment = async (user, post, comment) => {
     checkPost(post);
     checkComment(comment);

     return setDoc(
          doc(db, USERS, postCommentRoute(post.owner, post.published, user, comment.date)),
          comment.toJSON()
     );
};

const deleteComment = async (post, comment) => {
     checkPost(post);
     checkComment(comment);

     return deleteDoc(
          doc(db, USERS, postCommentRoute(post.owner, post.published, comment.user, comment.date))
     );
};

const editComment = async (post, comment, newComment) => {
     checkPost(post);
     checkComment(comment);
     checkComment(newComment);

     await setDoc(
          doc(
               db,
               USERS,
               postCommentVersionRoute(
                    post.owner,
                    post.published,
                    comment.user,
                    comment.date,
                    comment.edited
               )
          ),
          comment.toJSON()
     );

     return updateDoc(
          doc(db, USERS, postCommentRoute(post.owner, post.published, comment.user, comment.date)),
          newComment.toJSON()
     );
};

const sharePost = async (user, post, text) => {
     checkPost(post);

     const share = new ShareModel(user);
     const sharedPost = post.createShared(user, text, share.date);

     await setDoc(
          doc(db, USERS, postShareRoute(post.owner, post.published, user, share.date)),
          share.toJSON()
     );

     return setDoc(doc(db, USERS, postRoute(user, sharedPost.published)), sharedPost.toJSON());
};

const editPost = async (post, newPost) => {
     checkPost(post);
     checkPost(newPost);

     await setDoc(
          doc(db, USERS, postVersionRoute(post.owner, post.published, post.edited)),
          post.toJSON()
     );

     return await updateDoc(
          doc(db, USERS, postRoute(post.owner, post.published)),
          newPost.toJSON()
     );
};

const getUser = (uid) => getDoc(doc(db, USERS, uid));

const getUsers = () => getDocs(query(collection(db, USERS)));

const watchFollowing = (uid, onFirstLoad, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, USERS, followingsRoute(uid)));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               firstTime = false;
               onFirstLoad(snapshot.docs.map((item) => item.data()));
          }
     });
};

const watchFollowers = (uid, onFirstLoad, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, USERS, followersRoute(uid)));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               onFirstLoad(snapshot.docs.map((item) => item.data()));
               firstTime = false;
          }
     });
};

const watchPosts = (user, onLoaded, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, USERS, postsRoute(user)));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               onLoaded(snapshot.docs.map((item) => item.data()));
               firstTime = false;
          }
     });
};

const watchInteraction = (post, type, onLoaded, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, `users/${post.owner}/posts/${post.published}/${type}s`));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               onLoaded(snapshot.docs.map((item) => item.data()));
               firstTime = false;
          }
     });
};

const watchItems = (path, onLoaded, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, path));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               onLoaded(snapshot.docs.map((item) => item.data()));
               firstTime = false;
          }
     });
};

const watchItem2 = (path, uidField, uid, onLoaded, onAdded, onModified, onDeleted) => {
     const q = query(collection(db, path), where(uidField, "==", uid));

     let firstTime = true;

     return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
               if (change.type === "added" && !firstTime) {
                    onAdded(change.doc.data());
               }
               if (change.type === "modified") onModified(change.doc.data());
               if (change.type === "removed") onDeleted(change.doc.data());
          });

          if (firstTime) {
               onLoaded(snapshot.docs[0].data());
               firstTime = false;
          }
     });
};

const watchItem = (path, onLoaded) => {
     return onSnapshot(doc(db, path), { includeMetadataChanges: true }, (doc) => {
          let firstTime = true;
          if (firstTime) {
               firstTime = false;
               onLoaded(doc.data());
          }
     });
};

const updateUser = (uid, data) => {
     return updateDoc(doc(db, `users/${uid}`), data);
};

const uploadAsset = async (name, file) => {
     return uploadBytes(ref(storage, name), file).then(() => getImageURL(name));
};

const getUserDataList = async (uid, type) =>
     (await getDocs(query(collection(db, `users/${uid}/${type}`)))).docs.map((doc) => doc.data());

const getComments = async (uid, published) =>
     (await getDocs(query(collection(db, `users/${uid}/posts/${published}/comments`)))).docs.map(
          (doc) => CommentModel.fromData(doc.data())
     );

const getPost = async (uid, published) =>
     (await getDoc(doc(db, `users/${uid}/posts/${published}`))).data();

const getConversation = async (user, targetUser) =>
     getDoc(doc(db, `users/${user}/messages/hub/conversations/${targetUser}`));

const createConversation = async (user1, user2) => {
     const hub1 = await getDoc(doc(db, `users/${user1}/messages/hub`));

     if (!hub1.exists()) await setDoc(doc(db, `users/${user1}/messages/hub`), { latest: {} });

     const hub2 = await getDoc(doc(db, `users/${user2}/messages/hub`));

     if (!hub2.exists()) await setDoc(doc(db, `users/${user2}/messages/hub`), { latest: {} });

     const started = { by: user1, date: Date.now() };

     await setDoc(doc(db, `users/${user1}/messages/hub/conversations/${user2}`), {
          user: user2,
          latestMessage: {},
          started,
          seen: false,
     });
     await setDoc(doc(db, `users/${user2}/messages/hub/conversations/${user1}`), {
          user: user1,
          latestMessage: {},
          started,
          seen: false,
     });

     return true;
};

const sendMessage = async (message, target) => {
     await setDoc(
          doc(
               db,
               `users/${target}/messages/hub/conversations/${message.user}/messages/${message.date}-${message.user}`
          ),
          message.toJSON()
     );
     await setDoc(
          doc(
               db,
               `users/${message.user}/messages/hub/conversations/${target}/messages/${message.date}-${message.user}`
          ),
          message.toJSON()
     );

     await updateDoc(doc(db, `users/${message.user}/messages/hub`), { latest: message.toJSON() });
     await updateDoc(doc(db, `users/${target}/messages/hub`), { latest: message.toJSON() });

     await updateDoc(doc(db, `users/${message.user}/messages/hub/conversations/${target}`), {
          latestMessage: message.toJSON(),
          seen: false,
     });
     await updateDoc(doc(db, `users/${target}/messages/hub/conversations/${message.user}`), {
          latestMessage: message.toJSON(),
          seen: false,
     });

     return true;
};

export {
     signUp,
     signIn,
     uploadImage,
     getImageURL,
     createUser,
     followUser,
     unfollowUser,
     createPost,
     editPost,
     likePost,
     unlikePost,
     postComment,
     deleteComment,
     editComment,
     sharePost,
     getUser,
     getUsers,
     watchFollowing,
     watchFollowers,
     watchPosts,
     watchInteraction,
     watchItems,
     watchItem,
     watchItem2,
     updateUser,
     uploadAsset,
     getUserDataList,
     getComments,
     getPost,
     getConversation,
     createConversation,
     sendMessage,
};
