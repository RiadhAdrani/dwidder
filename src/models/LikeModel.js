import InteractionModel from "./InteractionModel";

class LikeInteraction extends InteractionModel {
     constructor(user) {
          super("like", user);
     }
}

export default LikeInteraction;
