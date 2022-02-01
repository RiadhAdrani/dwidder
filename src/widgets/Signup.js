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
import { SignUpAndLogin } from "../services/DataService";
import ProcessErrors from "../utils/ProcessErrors";
import logo from "../assets/icon.png";

export default () => {
     const [username, setUsername] = setState("signup-username", "");
     const [email, setEmail] = setState("signup-email", "");
     const [password, setPassword] = setState("signup-password", "");

     const [loading, setLoading] = setState("signup-loading", false);
     const [alert, setAlert] = setState("signup-alert", "");

     const [theme] = getState("current-theme");

     return Column({
          styleSheet: {
               className: "signup-view",
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
                           P({ text: "Creating account...", style: { marginLeft: "10px" } }),
                      ],
                 })
               : [
                      Img({ src: logo, height: 70, width: 70 }),
                      H1({ text: "Signup" }),
                      H4({ text: "Create a Dwidder account", style: { fontWeight: "300" } }),
                      EmptyBox({ height: "10px" }),
                      InputView([username, setUsername], "text", "Username"),
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
                           text: "Create Account",
                           styleSheet: {
                                className: "signup-button",
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
                                     setAlert("");
                                     setLoading(true);

                                     SignUpAndLogin(email, password, username)
                                          .then((user) => {
                                               const [_, setCurrentUser] = getState("current-user");
                                               setCurrentUser(UserModel.fromData(user.data()));

                                               goTo("/");
                                          })
                                          .catch((e) => {
                                               setAlert(ProcessErrors(e));
                                               setLoading(false);
                                          });
                                },
                           },
                      }),
                      EmptyBox({ height: "10px" }),
                      Link({
                           children: "Already have an account? Login here!",
                           to: "/login",
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
