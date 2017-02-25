import { Controller } from 'angular-ecmascript/module-helpers';
import { MeteorCameraUI } from 'meteor/supaseca:camera-ui';
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
    this.NewPost.showModal();
  }

  takePicture(){
    MeteorCameraUI.getPicture({}, (err, data) => {
      if(err) return this.handleError(err);

      this.$state.go('tab.newPost', { image: data });
    });
  }

  remove(post) {
    this.callMethod('removePost', post._id);
  }

  handleError(err){
    if(err.error == 'cancel' ) return;
    this.$log.error('Upload picture error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      oktype: 'button-positive button-clear'
    });
  }
}

PostsCtrl.$name = 'PostsCtrl';
PostsCtrl.$inject = ['NewPost', '$state'];
