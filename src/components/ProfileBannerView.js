import { Column } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";

export default (user) => {
     const [theme] = getState("current-theme");

     return Column({
          styleSheet: {
               className: "user-banner",
               normal: {
                    height: "300px",
                    background: `url(${user.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: theme.secondaryHover,
               },
          },
     });
};
