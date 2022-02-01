class InteractionModel {
     constructor(type, user, date = Date.now()) {
          this.type = type;
          this.user = user;
          this.date = date;
     }

     toJSON() {
          return {
               type: this.type,
               user: this.user,
               date: this.date,
          };
     }

     static fromData(data) {
          return new InteractionModel(data.type, data.user, data.date);
     }
}

export default InteractionModel;
