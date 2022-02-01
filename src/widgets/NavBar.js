import { Column, H2, I, Link, P, Row, Span } from "@riadh-adrani/recursive/Recursive-Components";
import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import UserModel from "../models/UserModel";
import { encode, mediaQueries } from "../Utils";

export default () => {
     const [user, setUser] = getState("current-user");
     const [theme] = getState("current-theme");

     const shortcuts = [
          { name: "Home", icon: "fas fa-house-user", route: "/" },
          { name: "Messages", icon: "fas fa-comment", route: "/messages" },
          {
               name: "Profile",
               icon: "fas fa-user",
               route: `/user@:${user.uid ? encode(user.uid) : ""};`,
          },
          { name: "Settings", icon: "fas fa-cog", route: "/settings" },
     ];

     return Column({
          styleSheet: {
               className: "shortcuts",
               normal: {
                    width: "250px",
                    position: "fixed",
                    top: "0",
                    background: theme.secondary,
                    height: "100vh",
                    justifyContent: "space-between",
               },
               mediaQueries: mediaQueries({ medium: { normal: { width: "75px" } } }),
          },
          children: [
               Row({
                    style: { alignItems: "center", marginTop: "20px", justifyContent: "center" },
                    children: [
                         I({
                              className: "fas fa-bacon",
                              style: { fontSize: "2em", color: theme.color, marginRight: "10px" },
                         }),
                         H2({
                              text: "Dwidder",
                              styleSheet: {
                                   className: "dwidder-main-title",
                                   mediaQueries: mediaQueries({
                                        medium: {
                                             normal: { display: "none" },
                                        },
                                   }),
                              },
                         }),
                    ],
               }),
               Column({
                    style: { marginTop: "30px" },
                    children: shortcuts.map((item) =>
                         Link({
                              to: item.route,
                              styleSheet: {
                                   className: "shortuct",
                                   normal: {
                                        padding: "10px 20px",
                                        margin: "5px 10px",
                                        display: "flex",
                                        fontSize: "1.1em",
                                        borderRadius: "50px",
                                        color: "inherit",
                                        textDecoration: "none",
                                   },
                                   hover: {
                                        background: theme.secondaryHover,
                                        cursor: "pointer",
                                   },
                                   mediaQueries: mediaQueries({
                                        medium: {
                                             normal: {
                                                  alignItems: "center",
                                                  margin: "5px",
                                                  padding: "10px",
                                             },
                                        },
                                   }),
                              },
                              children: [
                                   Span({
                                        text: I({
                                             className: item.icon,
                                             style: { color: theme.color },
                                        }),
                                        styleSheet: {
                                             className: "shortcut-icon",
                                             normal: {
                                                  marginRight: "15px",
                                                  height: "30px",
                                                  width: "30px",
                                             },
                                             mediaQueries: mediaQueries({
                                                  medium: {
                                                       normal: {
                                                            margin: "auto",
                                                            height: "auto",
                                                            width: "auto",
                                                       },
                                                  },
                                             }),
                                        },
                                   }),
                                   P({
                                        text: item.name,
                                        styleSheet: {
                                             className: "shortcut-text",
                                             mediaQueries: mediaQueries({
                                                  medium: {
                                                       normal: { display: "none", margin: "0px" },
                                                  },
                                             }),
                                        },
                                   }),
                              ],
                         })
                    ),
               }),
               Row({
                    styleSheet: {
                         className: "sign-out-shortcut",
                         normal: {
                              padding: "10px 20px",
                              margin: "auto 5px 10px 5px",
                              fontSize: "1em",
                              borderRadius: "50px",
                              alignItems: "center",
                         },
                         hover: {
                              background: theme.secondaryHover,
                              cursor: "pointer",
                         },
                         mediaQueries: mediaQueries({
                              medium: {
                                   normal: { justifyContent: "center" },
                              },
                         }),
                    },
                    events: {
                         onClick: () => {
                              setUser(UserModel.loadingUser());
                              goTo("/login");
                         },
                    },
                    children: [
                         I({
                              className: "fas fa-sign-out-alt",
                              styleSheet: {
                                   className: "user-shortcut-icon",
                                   normal: {
                                        background: theme.color,
                                        color: theme.textContrast,
                                        padding: "10px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                   },
                                   mediaQueries: mediaQueries({
                                        medium: {
                                             normal: { margin: "auto" },
                                        },
                                   }),
                              },
                         }),
                         P({
                              text: "Log out",
                              styleSheet: {
                                   className: "user-shortcut-text",
                                   mediaQueries: mediaQueries({
                                        medium: {
                                             normal: { display: "none" },
                                        },
                                   }),
                              },
                         }),
                    ],
               }),
          ],
     });
};
