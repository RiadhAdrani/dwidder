import {
     BorderSpinner,
     Column,
     EmptyBox,
     I,
     Input,
     P,
     Row,
} from "@riadh-adrani/recursive/Recursive-Components";
import { getState, setState } from "@riadh-adrani/recursive/Recursive-State";
import UserCard from "../components/UserCard";
import { GetSearchResult } from "../services/DataService";
import { mediaQueries } from "../Utils";

export default () => {
     const [theme] = getState("current-theme");

     const [search, setSearch] = setState("search-query", "");
     const [result, setResult] = setState("search-result", []);
     const [isSearching, setIsSearching] = setState("search-loading", false);

     return Column({
          styleSheet: {
               className: "side-bar",
               normal: {
                    width: "310px",
                    position: "fixed",
                    top: "0",
                    right: "0",
                    background: theme.secondary,
                    height: "100vh",
                    padding: "10px 20px",
               },
               mediaQueries: mediaQueries({ small: { normal: { display: "none" } } }),
          },
          children: [
               Row({
                    styleSheet: {
                         className: "side-bar-search-wrapper",
                         normal: {
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px 15px",
                              border: `1px solid ${theme.secondaryHover}`,
                              borderRadius: "20px",
                         },
                    },
                    children: [
                         I({ className: "fas fa-search", style: { margin: "0px 10px" } }),
                         Input({
                              placeholder: "Search...",
                              value: search,
                              events: {
                                   onChange: (e) => {
                                        if (e.target.value.trim()) {
                                             const sq = e.target.value;

                                             setIsSearching(true);
                                             setSearch(sq);

                                             GetSearchResult(sq).then((res) => {
                                                  if (sq === e.target.value) {
                                                       setIsSearching(false);
                                                       setResult(res);
                                                  }
                                             });
                                        } else {
                                             setSearch("");
                                             setResult([]);
                                             setIsSearching(false);
                                        }
                                   },
                              },
                              type: "text",
                              styleSheet: {
                                   className: "side-bar-search-field",
                                   normal: {
                                        background: "transparent",
                                        border: "none",
                                        color: "inherit",
                                        padding: "5px 10px",
                                        borderBottom: "1px solid transparent",
                                        flex: 1,
                                   },
                                   focus: {
                                        outline: `none`,
                                        borderBottomColor: theme.color,
                                   },
                              },
                         }),
                    ],
               }),
               Column({
                    styleSheet: {
                         className: "search-result-wrapper",
                         normal: {
                              marginTop: "10px",
                         },
                    },
                    children: isSearching
                         ? Column({
                                styleSheet: {
                                     className: "search-result-pending",
                                     normal: {
                                          alignItems: "center",
                                          marginTop: "10px",
                                     },
                                },
                                children: [
                                     BorderSpinner({
                                          color: theme.color,
                                          size: "15px",
                                          thickness: "5px",
                                     }),
                                     EmptyBox({ height: "5px" }),
                                     P({ text: "Looking for users..." }),
                                ],
                           })
                         : result.length === 0 && search.trim()
                         ? Column({
                                styleSheet: {
                                     className: "search-no-result",
                                     normal: {
                                          alignItems: "center",
                                          marginTop: "10px",
                                     },
                                },
                                children: [
                                     I({
                                          className: "fas fa-users-slash",
                                          style: { color: theme.color, fontSize: "1.5em" },
                                     }),
                                     EmptyBox({ height: "5px" }),
                                     P({ text: "No user found for this search query" }),
                                ],
                           })
                         : result.map((item) => UserCard(item)),
               }),
               P({
                    text: "Dwidder © 2022 - Powered by Recursive.Js",
                    style: {
                         color: `${theme.text}66`,
                         textAlign: "center",
                         position: "fixed",
                         bottom: "10px",
                         right: "20px",
                         fontSize: "0.8em",
                    },
               }),
          ],
     });
};
