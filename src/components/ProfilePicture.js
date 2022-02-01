import { Column, Img } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (pic) => {
     const [theme] = getState("current-theme");

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
          ],
     });
};
