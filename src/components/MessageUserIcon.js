import { Column, Img, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import UserModel from "../models/UserModel";
import { GetUserInfo } from "../services/DataService";

export default (uid) => {
     const [theme] = getState("current-theme");

     const [user, setUser] = setState(`user-${uid}`, UserModel.loadingUser(), () => {
          GetUserInfo(uid).then((doc) => setUser(UserModel.fromData(doc.data())));
     });

     return Column({
          styleSheet: {
               className: "user-message-wrapper",
               normal: {
                    padding: "5px",
                    marginRight: "10px",
                    borderRadius: "10px",
               },
               hover: {
                    cursor: "pointer",
                    background: theme.secondaryHover,
               },
          },
          children: [
               Img({
                    src: user.pic,
                    width: "40",
                    height: "40",
                    styleSheet: {
                         className: "user-msg-icon",
                         normal: {
                              borderRadius: "50%",
                         },
                    },
               }),
          ],
     });
};
