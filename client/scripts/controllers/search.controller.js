import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class SearchCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.query = '';
    this.helpers({
        users(query){
          const query1 = this.getReactively('query');
          if(_.isEmpty(query1)){
            return Meteor.users.find({_id: {$ne: Meteor.userId() }});
          }else{
            return Meteor.users.find({_id: {$ne: Meteor.userId() },  "username": {$regex: query1} });
          }
        },
        currentUser(){
            return this.currentUser;
        }
    });
  }

  areFriend(id){
    if(!this.currentUser.profile)
    return false;
    var friends = this.currentUser.profile.friendIds;
    return friends.indexOf(id) != -1;
  }

  confirm(){
    $scope.users = {};
  }

  follow(otherId){
    this.callMethod('newFriend', otherId, (err) => {
        if (err) return;
        this.$state.go('tab.search');
    });

  }

  unFollow(otherId){
    this.callMethod('removeFriend', otherId, (err) => {
        if (err) return;
        this.$state.go('tab.search');
    });

  }

}

SearchCtrl.$name = 'SearchCtrl';
SearchCtrl.$inject = ['$scope', '$state'];
