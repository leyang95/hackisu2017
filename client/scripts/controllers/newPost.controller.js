import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class NewPostCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.subscribe('users');
    this.image = this.$state.params.image;
  }

  confirm() {
    if (_.isEmpty(this.caption)) return;
    newPost(this.currentUserId);
  }

  newPost(userId) {
    this.callMethod('newPost', userId, (err, postId) => {
      // this.hideNewPostModal();
      if (err) return this.handleError(err);
      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        postId: this.postId
      });
      this.goToPost(postId);
    });
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
