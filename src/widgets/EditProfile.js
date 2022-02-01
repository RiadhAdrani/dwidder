import {
     BorderSpinner,
     Column,
     EmptyBox,
     H1,
     I,
     P,
     Row,
     Span,
} from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/Recursive-State";
import EditButton from "../components/EditButton";
import EditProfileBanner from "../components/EditProfileBanner";
import EditProfileField from "../components/EditProfileField";
import EditProfileInput from "../components/EditProfileInput";
import EditProfilePicture from "../components/EditProfilePicture";
import { uploadAsset } from "../db/Firebase";
import { UpdateUser } from "../services/DataService";
import { browseFile, encode } from "../Utils";

const bannerMaxSize = 2097152;
const picMaxSize = 1048576;

export default (user) => {
     const [theme] = getState("current-theme");
     const [_, setEdit] = getState("edit-profile");

     const [displayName, setDisplayName] = setState("edit-user-display-name", user.displayName);
     const [about, setAbout] = setState("edit-user-about", user.about);
     const [pic, setPic] = setState("edit-user-pic", { src: user.pic, file: null });
     const [banner, setBanner] = setState("edit-user-banner", { src: user.banner, file: null });
     const [alert, setAlert] = setState("edit-user-alert", "");

     const [uploading, setUploading] = setState("edit-is-uploading", false);

     return Column({
          style: {
               position: "fixed",
               inset: "0",
               backgroundColor: "#000000aa",
               width: "100%",
               height: "100%",
               zIndex: 2,
          },
          children: [
               Column({
                    style: {
                         margin: "50px",
                         border: `2px solid ${theme.secondaryHover}`,
                         background: theme.main,
                         flex: 1,
                    },
                    children: [
                         Column({
                              flags: {
                                   renderIf: uploading,
                              },
                              style: {
                                   position: "fixed",
                                   inset: 0,
                                   backgroundColor: "#000000ee",
                                   justifyContent: "center",
                                   alignItems: "center",
                              },
                              children: [
                                   BorderSpinner({ color: theme.color }),
                                   EmptyBox({ height: "10px" }),
                                   P({
                                        text: "Uploading your data, please wait...",
                                        style: { color: "white" },
                                   }),
                              ],
                         }),
                         EditProfileBanner(banner.src, () => {
                              browseFile((file) => {
                                   if (file.size > bannerMaxSize) {
                                        setAlert("Profile banner size cannot exceed 2 Mb");
                                   } else {
                                        setAlert("");
                                        setBanner({ src: URL.createObjectURL(file), file });
                                   }
                              });
                         }),
                         Row({
                              styleSheet: {
                                   className: "user-pic-wrapper",
                                   normal: {
                                        margin: "-60px 30px 10px 20px",
                                        justifyContent: "space-between",
                                   },
                              },
                              children: [
                                   EditProfilePicture(pic.src, () => {
                                        browseFile((file) => {
                                             if (file.size > picMaxSize) {
                                                  setAlert(
                                                       "Profile picture size cannot exceed 1 Mb"
                                                  );
                                             } else {
                                                  setAlert("");
                                                  setPic({ src: URL.createObjectURL(file), file });
                                             }
                                        });
                                   }),
                                   Row({
                                        style: { marginTop: "70px", marginBottom: "auto" },
                                        children: [
                                             EditButton("Save", () => {
                                                  setUploading(true);

                                                  (async () => {
                                                       const [eUser, seteUser] = getState(
                                                            `user-${user.uid}`
                                                       );

                                                       const changes = {};

                                                       if (displayName !== user.displayName) {
                                                            changes.displayName = displayName;
                                                            await UpdateUser(user.uid, {
                                                                 displayName,
                                                            });
                                                            eUser.displayName = displayName;
                                                       }

                                                       if (about !== user.about) {
                                                            changes.about = about;
                                                            await UpdateUser(user.uid, { about });
                                                            eUser.about = about;
                                                       }

                                                       if (pic.file !== null) {
                                                            changes.pic = pic.file;
                                                            const url = await uploadAsset(
                                                                 `${encode(user.uid)}-pic`,
                                                                 pic.file
                                                            ).then((url) =>
                                                                 UpdateUser(user.uid, { pic: url })
                                                            );
                                                            eUser.pic = url;
                                                       }

                                                       if (banner.file !== null) {
                                                            changes.banner = pic.file;
                                                            const url = await uploadAsset(
                                                                 `${encode(user.uid)}-banner`,
                                                                 banner.file
                                                            ).then((url) =>
                                                                 UpdateUser(user.uid, {
                                                                      banner: url,
                                                                 })
                                                            );
                                                            eUser.banner = url;
                                                       }

                                                       updateAfter(() => {
                                                            seteUser(user);
                                                            setEdit(false);
                                                       });
                                                  })();
                                             }),
                                             EditButton("Cancel", () => {
                                                  setEdit(false);
                                             }),
                                        ],
                                   }),
                              ],
                         }),
                         Column({
                              styleSheet: {
                                   className: "user-info-wrapper",
                                   normal: {
                                        padding: "0px 25px",
                                   },
                              },
                              children: [
                                   H1({
                                        text: displayName,
                                        styleSheet: {
                                             className: "user-display-name",
                                             normal: { fontSize: "1.5em" },
                                        },
                                   }),
                                   P({
                                        style: { margin: "10px 0px" },
                                        text: [
                                             I({ className: "fas fa-calendar-alt" }),
                                             " ",
                                             Span({
                                                  text: `Joined ${new Date(
                                                       user.joined
                                                  ).toLocaleDateString()}`,
                                             }),
                                        ],
                                   }),
                                   EmptyBox({ height: "10px" }),
                                   EditProfileInput("Display Name", displayName, 100, (e) => {
                                        setDisplayName(e.target.value);
                                   }),
                                   EmptyBox({ height: "20px" }),
                                   EditProfileField("About", about, 200, (e) => {
                                        setAbout(e.target.value);
                                   }),
                                   EmptyBox({ height: "10px" }),
                                   P({
                                        flags: {
                                             renderIf: alert !== "",
                                        },
                                        text: alert,
                                        styleSheet: {
                                             className: "signup-alert",
                                             normal: {
                                                  padding: "10px",
                                                  marginBottom: "15px",
                                                  color: "#fe1e1e",
                                                  border: "1px solid #fe1e1e",
                                                  borderRadius: "10px",
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
