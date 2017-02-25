import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class Posts extends Controller {
  constructor() {
    super(...arguments);

    this.subscribe('users');

    this.helpers({
      users() {
        return Meteor.users.find({ _id: { $ne: this.currentUserId } });
      }
    });
  }

  newPost(userId) {
    let post = Posts.findOne({ userIds: { $all: [this.currentUserId, userId] } });

    if (post) {
      this.hideNewPostModal();
      return this.goToPost(post._id);
    }

    this.callMethod('newPost', userId, (err, postId) => {
      this.hideNewPostModal();
      if (err) return this.handleError(err);
      this.goToPost(postId);
    });
  }

  hideNewPostModal() {
    this.NewPost.hideModal();
  }

  goToPost(postId) {
    this.$state.go('tab.post', { postId });
  }

  handleError(err) {
    this.$log.error('New post creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New post creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

NewPostCtrl.$name = 'NewPostCtrl';
NewPostCtrl.$inject = ['$state', 'NewPost', '$ionicPopup', '$log'];
