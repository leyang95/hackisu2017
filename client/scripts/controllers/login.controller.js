import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller {

  constructor(){
    super(...arguments);


    this.helpers({
      loggedIn(){
        if(Meteor.userId()){
          this.$state.go("tab.home");
        }
      }
    });



  }


}


LoginCtrl.$name = 'LoginCtrl';
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];
