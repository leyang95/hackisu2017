import { MeteorCameraUI } from 'meteor/supaseca:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';


export default class CameraCtrl extends Controller {
  constructor() {
    super(...arguments);


  }

  takePicture(){
    MeteorCameraUI.getPicture({}, (err, data) => {
      if(err) return;
      if(data){
          this.$state.go('newPost', {picture: data});
      }
    });
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

CameraCtrl.$name = 'CameraCtrl';
CameraCtrl.$inject =['$state', '$ionicPopup', '$log', '$scope'];
