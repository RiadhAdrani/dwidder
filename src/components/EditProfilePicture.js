import { Column, I, Img } from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";

export default (pic, onSelected) => {
     const [theme] = getState("current-theme");
     const [show, setShow] = setState("show-edit-profile-pic", false);

     return Column({
          styleSheet: {
               className: "user-profile-pic",
               normal: {
                    height: "120px",
                    width: "120px",
                    borderRadius: "50%",
                    border: `5px solid ${theme.main}`,
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
               Img({
                    src: pic,
                    height: "120",
                    width: "120",
                    styleSheet: {
                         className: "user-pic",
                         normal: {
                              backgroundColor: theme.secondaryHover,
                              borderRadius: "inherit",
                         },
                    },
               }),
               Column({
                    flags: { renderIf: show === true },
                    children: I({
                         className: "far fa-images",
                         style: { margin: "auto", color: "white" },
                    }),
                    styleSheet: {
                         className: "user-edit-pic",
                         normal: {
                              position: "absolute",
                              background: "#00000099",
                              inset: "auto",
                              zIndex: 1,
                              height: "120px",
                              width: "120px",
                              borderRadius: "inherit",
                              cursor: "pointer",
                         },
                    },
                    events: {
                         onClick: onSelected,
                    },
               }),
          ],
     });
};
