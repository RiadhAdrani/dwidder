import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import { watchItem, watchItem2, watchItems } from "../db/Firebase";
import FollowReferenceModel from "../models/FollowReferenceModel";
import UserModel from "../models/UserModel";

const setUserState = (user) => {
     const uid = `user-${user}`;

     const [get, set] = setState(
          uid,
          {
               user: UserModel.loadingUser(),
               unsubscribe: watchItem2(
                    `users`,
                    "uid",
                    user,
                    (item) => {
                         get.user = item;
                    },
                    (item) => {
                         console.log(item);
                    },
                    (item) => {
                         console.log(item);
                    },
                    (item) => {
                         console.log(item);
                    }
               ),
          },
          () => get.unsubscribe()
     );

     return [get.user];
};

const setDataState = (user, type) => {
     const uid = `user-${user}-${type}`;

     const [get, set] = setState(uid, []);

     if (user !== UserModel.loadingUser().email) {
          const [flow, setFlow] = setState(`${uid}-flow`, undefined, () => {
               flow ? flow() : "";
          });

          if (!flow) {
               setFlow(
                    watchItems(
                         `users/${user}/${type}`,
                         (list) => set(list),
                         (item) => {
                              console.log(get);
                              const [current] = getState(uid);
                              current.push(FollowReferenceModel.fromData(item));
                              set(current);
                         },
                         () => {},
                         (item) => {
                              const [current] = getState(uid);
                              set(current.filter((i) => i.user !== item.user));
                         }
                    )
               );
          }
     }

     return [get, set];
};

const setFollowingState = (user) => {
     return setDataState(user, "following");
};

const setFollowersState = (user) => {
     return setDataState(user, "followers");
};

const setCollectionState = (uid, path, onLoaded, onAdded, onModified, onDeleted) => {
     const [get, set, pre, exists, live] = setState(uid, []);
     const [watcher, setWatcher, prevWatcher, watcherExists, liveWatcher] = setState(
          `${uid}-flow`,
          undefined,
          () => {},
          () => liveWatcher()()
     );
     const [first, setFirst] = setState(`${uid}-flow-first`, true);

     if (first) {
          setFirst(false);

          if (liveWatcher() === undefined) {
               const unsubscribe = watchItems(
                    path,
                    (items) => {
                         updateAfter(() => {
                              set(items);
                              onLoaded(items);
                         });
                    },
                    (item) => {
                         updateAfter(() => {
                              set([...live(), item]);
                              onAdded(item);
                         });
                    },
                    (item) => {
                         updateAfter(() => {
                              onModified(item);
                         });
                    },
                    (item) => {
                         updateAfter(() => {
                              onDeleted(item);
                         });
                    }
               );

               setWatcher(unsubscribe);
          }
     }

     return [get, set, live];
};

export { setUserState, setFollowersState, setFollowingState, setCollectionState };
