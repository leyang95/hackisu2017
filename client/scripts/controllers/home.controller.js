import { Controller } from 'angular-ecmascript/module-helpers';
import { Posts } from '../../../lib/collections';

export default class HomeCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Posts.find();
      }
    });
  }

  remove(post) {
    this.callMethod('removePost', post._id);
  }
}

HomeCtrl.$name = 'HomeCtrl';
HomeCtrl.$inject = ['$state'];
