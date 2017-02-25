import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts, Messages } from '../../../lib/collections';

export default class NewPostCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.picture = this.$state.params.picture;
    if(_.isEmpty(this.picture)){
      this.picture = "http://www.planwallpaper.com/static/images/desktop-year-of-the-tiger-images-wallpaper.jpg";
    }
    this.subscribe('users');
  }

  confirm() {
    if (_.isEmpty(this.picture)) return;
    this.newPost(this.currentUserId);
  }

  newPost(userId) {
    this.callMethod('newPost', userId, (err, postId) => {
      // this.hideNewPostModal();
      if (err) return this.handleError(err);
      this.callMethod('newMessage', {
        picture: this.picture,
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
