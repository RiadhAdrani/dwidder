import InteractionModel from "./InteractionModel";

class CommentModel extends InteractionModel {
     constructor(user, date = Date.now(), edited = Date.now(), text, versions = []) {
          super("comment", user, date);

          this.edited = edited;
          this.text = text;
          this.versions = versions;
     }

     toJSON() {
          return {
               text: this.text,
               user: this.user,
               type: this.type,
               date: this.date,
               edited: this.edited,
          };
     }

     static fromData(data) {
          return new CommentModel(data.user, data.date, data.edited, data.text, data.versions);
     }
}

export default CommentModel;
