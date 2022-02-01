import { P } from "@riadh-adrani/recursive/Recursive-Components";

export default (alert) =>
     P({
          flags: {
               renderIf: alert !== "",
          },
          text: alert,
          styleSheet: {
               className: "alert-text",
               normal: {
                    padding: "10px",
                    margin: "15px 0px",
                    color: "#fe1e1e",
                    border: "1px solid #fe1e1e",
                    borderRadius: "10px",
               },
          },
     });
