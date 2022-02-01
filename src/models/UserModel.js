class UserModel {
     constructor(uid, displayName, joined = Date.now(), pic = "", banner = "", about = "") {
          this.uid = uid;
          this.displayName = displayName;
          this.joined = joined;
          this.pic = pic;
          this.banner = banner;
          this.about = about;
     }

     toJSON() {
          return {
               uid: this.uid,
               displayName: this.displayName,
               joined: this.joined,
               pic: this.pic,
               banner: this.banner,
               about: this.about,
          };
     }

     static fromData(user) {
          return new UserModel(
               user.uid,
               user.displayName,
               user.joined,
               user.pic,
               user.banner,
               user.about
          );
     }

     static loadingUser = () => {
          const l = new UserModel("Loading...", "Loading...", Date.now);
          l.isLoading = true;
          return l;
     };

     static disconnectedUser = () => {
          const u = new UserModel("Loading...", "Loading...", Date.now);
          u.isDisconnected = true;
          return u;
     };
}

export default UserModel;
