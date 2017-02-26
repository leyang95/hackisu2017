import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class HomeCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        if(!Meteor.user().profile){
          return;
        }
        var friends = Meteor.user().profile.friendIds;
        friends.push(Meteor.userId());
        return Posts.find({userId: {$in : friends}});
      }
    });
  }

  remove(post) {
    this.callMethod('removePost', post._id);
  }
}

HomeCtrl.$name = 'HomeCtrl';
HomeCtrl.$inject = ['$state'];
