import InteractionModel from "./InteractionModel";

class ShareModel extends InteractionModel {
     constructor(user, date = Date.now()) {
          super("share", user, date);
     }
}

export default ShareModel;
