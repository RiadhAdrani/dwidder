import { Column, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import UserModel from "../models/UserModel";
import { mediaQueries } from "../Utils";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

export default (children) => {
     const [user] = getState("current-user");

     if (user.uid === UserModel.loadingUser().uid) {
          goTo("/login");
     }

     return Row({
          styleSheet: {
               className: "template",
               normal: {
                    minHeight: "100vh",
                    width: "-webkit-fill-available",
               },
          },
          children: [
               NavBar(),
               Column({
                    styleSheet: {
                         className: "template-content",
                         normal: {
                              margin: "0px 350px 0px 250px",
                              width: "-webkit-fill-available",
                         },
                         mediaQueries: mediaQueries({
                              medium: { normal: { marginLeft: "75px" } },
                              small: { normal: { marginRight: "0px" } },
                         }),
                    },
                    children,
               }),
               SideBar(),
          ],
     });
};
