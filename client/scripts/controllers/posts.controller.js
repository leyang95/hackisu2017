import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class PostsCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Posts.find();
      }
    });
  }

  showNewPostsModal() {
    this.NewPosts.showModal();
  }

  remove(post) {
    this.callMethod('removePost', post._id);
  }
}

PostsCtrl.$name = 'PostsCtrl';
PostsCtrl.$inject = ['NewPost'];
