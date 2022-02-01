class PostModel {
     constructor(owner, text, img, published = Date.now(), edited = Date.now(), original = true) {
          this.owner = owner;
          this.text = text;
          this.img = img;
          this.published = published;
          this.edited = edited;
          this.original = original;
     }

     toJSON() {
          return {
               owner: this.owner,
               text: this.text,
               img: this.img,
               published: this.published,
               edited: this.edited,
               original: this.original,
          };
     }

     createShared(user, text, date) {
          return new PostModel(user, text, "", date, date, {
               from: this.owner,
               published: this.published,
          });
     }

     static fromData(post) {
          return new PostModel(
               post.owner,
               post.text,
               post.img,
               post.published,
               post.edited,
               post.original
          );
     }

     static loading = () => {
          const p = new PostModel("Loading...", "Loading...", "");
          p.isLoading = true;
          return p;
     };
}

export default PostModel;
