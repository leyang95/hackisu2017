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
            return Meteor.users.find({});
          }else{
            this.params = {"username": {$regex: query1}};
            return Meteor.users.find(this.params);
          }
        }
    });
  }

  confirm(){
    $scope.users = {};
  }

}

SearchCtrl.$name = 'SearchCtrl';
SearchCtrl.$inject = ['$scope'];
