import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Posts} from '../lib/collections.js';

Meteor.startup(function () {
    if (Meteor.users.find().count() != 0) return;

});