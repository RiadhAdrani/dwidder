import { H3, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (text, onClick = () => {}) => {
     const [theme] = getState("current-theme");

     return Row({
          styleSheet: {
               className: "sticky-settings",
               normal: {
                    position: "fixed",
                    background: `${theme.secondary}cc`,
                    width: "-webkit-fill-available",
                    backdropFilter: "blur(5px)",
                    alignItems: "center",
                    height: "50px",
                    paddingLeft: "30px",
               },
               hover: {
                    background: `${theme.color}44`,
                    cursor: "pointer",
               },
          },
          events: {
               onClick: () => {
                    scrollTo({ top: 0, behavior: "smooth" });
                    onClick();
               },
          },
          children: H3({ text }),
     });
};
