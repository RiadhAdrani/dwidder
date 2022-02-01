import { goTo } from "@riadh-adrani/recursive/Recursive-Router";
import UserModel from "./models/UserModel";

function mediaQueries({ medium = {}, small = {}, smaller = {}, tiny = {} }) {
     return [
          { condition: "(max-width:1100px)", ...medium },
          { condition: "(max-width:800px)", ...small },
          { condition: "(max-width:600px)", ...smaller },
          { condition: "(max-width:400px)", ...tiny },
     ];
}

function encode(value) {
     return value
          .split("")
          .map((char) => char.charCodeAt(0))
          .join("-");
}

function decode(value) {
     return value
          .split("-")
          .map((char) => String.fromCharCode(char))
          .join("");
}

function browseFile(onSelected) {
     const input = document.createElement("input");
     input.type = "file";

     input.onchange = () => {
          const file = input.files[0];
          onSelected(file, input.value);
     };

     input.click();
}

function since(time) {
     const delta = Date.now() - time;

     const second = 1000;
     const minute = second * 60;
     const hour = minute * 60;
     const day = hour * 24;
     const week = day * 7;
     const month = day * 30;
     const year = day * 365;

     const trunc = (n, d) => Math.trunc(n / d);

     if (delta >= year) return `${trunc(delta, year)} ${trunc(delta, year) > 1 ? "years" : "year"}`;

     if (delta >= month)
          return `${trunc(delta, month)} ${trunc(delta, month) > 1 ? "months" : "month"}`;

     if (delta >= week) return `${trunc(delta, week)} ${trunc(delta, week) > 1 ? "weeks" : "week"}`;

     if (delta >= day) return `${trunc(delta, day)} ${trunc(delta, day) > 1 ? "days" : "day"}`;

     if (delta >= hour) return `${trunc(delta, hour)} ${trunc(delta, hour) > 1 ? "hours" : "hour"}`;

     if (delta >= minute)
          return `${trunc(delta, minute)} ${trunc(delta, minute) > 1 ? "minutes" : "minute"}`;

     return `${trunc(delta, second)} ${trunc(delta, second) > 1 ? "seconds" : "second"}`;
}

function goToUserPage(uuid) {
     if (uuid !== UserModel.loadingUser().email) {
          goTo(`/user@:${encode(uuid)};`);
     }
}

export { encode, decode, browseFile, since, mediaQueries, goToUserPage };
