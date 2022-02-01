class FollowReferenceModel {
     constructor(user, date = Date.now()) {
          this.user = user;
          this.date = date;
     }

     toJSON() {
          return { user: this.user, date: this.date };
     }

     static fromData(follow) {
          return new FollowReferenceModel(follow.user, follow.date);
     }
}

export default FollowReferenceModel;
