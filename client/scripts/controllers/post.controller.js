import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class PostCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Posts.find();
      }
    });
  }

  showNewChatModal() {
    this.NewPost.showModal();
  }

  remove(post) {
    this.callMethod('removeChat', post._id);
  }
}

PostCtrl.$name = 'PostCtrl';
PostCtrl.$inject = ['NewPost'];
