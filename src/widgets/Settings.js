import { Column, H3, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import { GetThemes } from "../Colors";

export default () => {
     const [theme] = getState("current-theme");

     return Column({
          styleSheet: {
               className: "settings-view",
          },
          children: [
               Row({
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
                         },
                    },
                    children: H3({ text: "Settings" }),
               }),
               Column({
                    styleSheet: {
                         className: "settings-theme",
                         normal: {
                              marginTop: "60px",
                              padding: "10px",
                         },
                    },
                    children: [
                         P({
                              text: "Choose your preferred theme : ",
                         }),
                         Row({
                              children: GetThemes().map((color) => {
                                   return P({
                                        text: color.name,
                                        styleSheet: {
                                             className: `color-${color.name}`,
                                             normal: {
                                                  background: color.main,
                                                  border: `1px solid ${color.text}`,
                                                  flex: 1,
                                                  color: color.text,
                                                  padding: "20px",
                                                  margin: "10px",
                                                  borderRadius: "10px",
                                             },
                                             hover: {
                                                  background: color.mainHover,
                                                  cursor: "pointer",
                                             },
                                        },
                                        events: {
                                             onClick: () => {
                                                  const [_, setTheme] = getState("current-theme");
                                                  document.cookie = `${color.name}`;
                                                  setTheme(color);
                                             },
                                        },
                                   });
                              }),
                         }),
                    ],
               }),
          ],
     });
};
