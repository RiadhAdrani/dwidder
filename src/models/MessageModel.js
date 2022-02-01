export default class MessageModel {
     constructor(user, text, date, seen) {
          this.user = user;
          this.text = text;
          this.date = date;
          this.seen = seen;
     }

     static fromData(data) {
          return new MessageModel(data.user, data.text, data.date, data.seen);
     }

     toJSON() {
          return {
               user: this.user,
               text: this.text,
               date: this.date,
               seen: this.seen,
          };
     }
}
