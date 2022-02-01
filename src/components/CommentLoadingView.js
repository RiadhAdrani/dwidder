import { Column, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default () => {
     const [theme] = getState("current-theme");

     const themeGradient = `linear-gradient(90deg, 
        ${theme.mainHover} 0%, 
        ${theme.secondaryHover} 16%, 
        ${theme.secondary} 33%, 
        ${theme.secondary} 44%, 
        ${theme.secondaryHover} 55%, 
        ${theme.mainHover} 67%, 
        ${theme.secondaryHover} 84%, 
        ${theme.secondary} 100%)`;

     return Row({
          styleSheet: {
               className: "comment-view",
               normal: {
                    padding: "10px",
                    borderRadius: "10px",
                    border: `1px solid ${theme.secondaryHover}`,
                    marginBottom: "5px",
               },
          },
          children: [
               Column({
                    style: {
                         flex: 1,
                    },
                    children: [
                         P({
                              className: "sliding-gradient",
                              styleSheet: {
                                   className: "comment-loading-top",
                                   normal: {
                                        backgroundImage: themeGradient,
                                        height: "10px",
                                        marginBottom: "5px",
                                   },
                              },
                         }),
                         P({
                              className: "sliding-gradient",
                              styleSheet: {
                                   className: "comment-loading-bottom",
                                   normal: {
                                        backgroundImage: themeGradient,
                                        height: "15px",
                                   },
                              },
                         }),
                    ],
               }),
          ],
     });
};
