import {
     BorderSpinner,
     Button,
     Column,
     EmptyBox,
     H1,
     H4,
     Img,
     Link,
     P,
     Row,
} from "@riadh-adrani/recursive/Recursive-Components";
import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import InputView from "../components/InputView";
import UserModel from "../models/UserModel";
import { Login } from "../services/DataService";
import logo from "../assets/icon.png";

export default () => {
     const [email, setEmail] = setState("login-email", "");
     const [password, setPassword] = setState("login-password", "");
     const [alert, setAlert] = setState("login-alert", "");
     const [loading, setLoading] = setState("login-loading", false);

     const [theme] = getState("current-theme");

     const [user] = getState("current-user");

     if (user.uid !== UserModel.loadingUser().uid) {
          goTo("/");
     }

     return Column({
          styleSheet: {
               className: "login-view",
               normal: {
                    padding: "30px 20px",
                    border: `1px solid ${theme.secondaryHover}`,
                    borderRadius: "10px",
                    margin: "auto",
                    width: "300px",
               },
          },
          children: loading
               ? Row({
                      style: {
                           alignSelf: "center",
                           alignItems: "center",
                           justifyContent: "space-evenly",
                      },
                      children: [
                           BorderSpinner({ color: theme.color, size: "30px" }),
                           P({ text: "Logging in...", style: { marginLeft: "10px" } }),
                      ],
                 })
               : [
                      Img({ src: logo, height: 70, width: 70 }),
                      H1({ text: "Login" }),
                      H4({ text: "Login with your Dwidder account", style: { fontWeight: "300" } }),
                      EmptyBox({ height: "10px" }),
                      InputView([email, setEmail], "email", "Email"),
                      InputView([password, setPassword], "password", "Password"),
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
                      Button({
                           text: "Connect",
                           styleSheet: {
                                className: "login-button",
                                normal: {
                                     border: `1px solid ${theme.color}`,
                                     color: theme.color,
                                     background: "none",
                                     padding: "10px",
                                     borderRadius: "10px",
                                },
                                hover: {
                                     background: theme.color,
                                     color: theme.text,
                                     cursor: "pointer",
                                },
                           },
                           events: {
                                onClick: () => {
                                     setLoading(true);
                                     Login(email, password)
                                          .then((user) => {
                                               const [_, setCurrentUser] = getState("current-user");

                                               setCurrentUser(UserModel.fromData(user.data()));
                                               goTo("/");
                                          })
                                          .catch(() => {
                                               setAlert(
                                                    "Email and password combination does not match any user."
                                               );
                                          });
                                },
                           },
                      }),

                      EmptyBox({ height: "10px" }),
                      Link({
                           children: "No account yet? Sign up!",
                           to: "/signup",
                           styleSheet: {
                                className: "no-account-link",
                                normal: {
                                     color: theme.color,
                                     textDecoration: "none",
                                     textAlign: "center",
                                },
                           },
                      }),
                 ],
     });
};
