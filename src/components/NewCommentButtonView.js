import { Button } from "@riadh-adrani/recursive/Recursive-Components";
import { getState } from "@riadh-adrani/recursive/Recursive-State";
import Spinner from "./Spinner";

export default (loading, onClick) => {
     const [theme] = getState("current-theme");

     return Button({
          text: loading ? Spinner() : "Comment",
          disabled: loading,
          styleSheet: {
               className: "new-comment-button-view",
               normal: {
                    background: theme.color,
                    color: "white",
                    border: `none`,
                    borderRadius: "10px",
                    margin: "auto 10px",
                    padding: "7.5px",
                    cursor: "pointer",
               },
          },
          events: { onClick },
     });
};
