import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';

export default class PostNameFilter extends Filter {
  filter(post) {
    if (!post) return;

    let otherId = _.without(post.userIds, Meteor.userId())[0];
    let otherUser = Meteor.users.findOne(otherId);
    let hasName = otherUser && otherUser.profile && otherUser.profile.name;
    return hasName ? otherUser.profile.name : post.name || 'NO NAME';
  }
}

PostNameFilter.$name = 'postName';
