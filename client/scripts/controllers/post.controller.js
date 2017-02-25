import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { MeteorCameraUI } from 'meteor/supaseca:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts, Messages } from '../../../lib/collections';

export default class PostCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.postId = this.$stateParams.postId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;

    this.helpers({
      messages() {
        return Messages.find({ postId: this.postId });
      },
      data() {
        return Posts.findOne(this.postId);
      }
    });

    this.autoScroll();
  }

  sendMessage() {
    if (_.isEmpty(this.message)) return;

    this.callMethod('newMessage', {
      text: this.message,
      type: 'text',
      postId: this.postId
    });

    delete this.message;
  }

  sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) => {
      if(err) return this.handleError(err);

      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        postId: this.postId
      });
    });
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.scrollBottom(true);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('postScroll').resize();
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  autoScroll() {
    let recentMessagesNum = this.messages.length;

    this.autorun(() => {
      const currMessagesNum = this.getCollectionReactively('messages').length;
      const animate = recentMessagesNum != currMessagesNum;
      recentMessagesNum = currMessagesNum;
      this.scrollBottom(animate);
    });
  }

  scrollBottom(animate) {
    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('postScroll').scrollBottom(animate);
    }, 300);
  }

  handleError(err){
    if(err.error == 'cancel' ) return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      oktype: 'button-positive button-clear'
    });
  }
}

PostCtrl.$name = 'PostCtrl';
PostCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
