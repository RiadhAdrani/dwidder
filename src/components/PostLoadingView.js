import { Column, Div, H4, Img, P, Row } from "@riadh-adrani/recursive/Recursive-Components";
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
               className: "post-view",
               normal: {
                    padding: "20px 20px 10px 20px",
                    border: `1px solid ${theme.text}22`,
                    borderRadius: "20px",
                    marginBottom: "10px",
               },
          },
          children: [
               Column({
                    styleSheet: {
                         className: "loading-post-info-wrapper",
                         normal: {
                              width: "100%",
                         },
                    },
                    children: [
                         H4({
                              className: "sliding-gradient",
                              styleSheet: {
                                   className: "loading-post-title",
                                   normal: {
                                        backgroundImage: themeGradient,
                                        height: "10px",
                                   },
                              },
                         }),
                         Row({
                              className: "sliding-gradient",
                              styleSheet: {
                                   className: "loading-post-actions",
                                   normal: {
                                        justifyContent: "space-evenly",
                                        marginTop: "5px",
                                        backgroundImage: themeGradient,
                                        height: "20px",
                                   },
                              },
                         }),
                    ],
               }),
          ],
     });
};
