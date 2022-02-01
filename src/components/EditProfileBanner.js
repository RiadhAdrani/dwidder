import { Column, I, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";

export default (banner, onSelected) => {
     const [theme] = getState("current-theme");
     const [show, setShow] = setState("show-edit-profile-banner", false);

     return Column({
          styleSheet: {
               className: "edit-user-banner",
               normal: {
                    height: "300px",
                    background: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: theme.secondaryHover,
               },
          },
          events: {
               onMouseEnter: () => {
                    setShow(true);
               },
               onMouseLeave: () => {
                    setShow(false);
               },
          },
          children: [
               Row({
                    flags: { renderIf: show === true },
                    style: { backgroundColor: "#00000099", flex: 1, cursor: "pointer" },
                    children: [
                         I({
                              className: "far fa-images",
                              style: { margin: "auto", color: "white" },
                         }),
                    ],
                    events: { onClick: onSelected },
               }),
          ],
     });
};
