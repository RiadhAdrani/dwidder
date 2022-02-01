import { Column, Div, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import { MakeLoadingGradient } from "../Colors";

export default () => {
     const [theme] = getState("current-theme");

     return Column({
          children: [
               Div({
                    className: "sliding-gradient",
                    style: { height: "300px", backgroundImage: MakeLoadingGradient() },
               }),
               Row({
                    className: "sliding-gradient",
                    style: {
                         width: "120px",
                         height: "120px",
                         borderRadius: "50%",
                         marginTop: "-50px",
                         marginLeft: "20px",
                         border: `5px solid ${theme.main}`,
                         backgroundImage: MakeLoadingGradient(),
                    },
               }),
               Column({
                    children: [
                         Row({
                              className: "sliding-gradient",
                              style: {
                                   height: "20px",
                                   margin: "5px",
                                   backgroundImage: MakeLoadingGradient(),
                              },
                         }),
                         Row({
                              className: "sliding-gradient",
                              style: {
                                   height: "10px",
                                   margin: "5px",
                                   backgroundImage: MakeLoadingGradient(),
                              },
                         }),
                         Row({
                              className: "sliding-gradient",
                              style: {
                                   height: "10px",
                                   margin: "5px",
                                   backgroundImage: MakeLoadingGradient(),
                              },
                         }),
                         Row({
                              className: "sliding-gradient",
                              style: {
                                   height: "10px",
                                   margin: "5px",
                                   backgroundImage: MakeLoadingGradient(),
                              },
                         }),
                    ],
               }),

               Row({
                    children: [],
                    style: {
                         padding: "10px 20px",
                         background: theme.secondary,
                         marginTop: "10px",
                         fontSize: "1.25em",
                    },
               }),
          ],
     });
};
