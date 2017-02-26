import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';

export default class PostNameFilter extends Filter {
  filter(post) {
    if (!post) return;

    let otherUser = Meteor.users.findOne(post.userId);
    return otherUser.username;
  }
}

PostNameFilter.$name = 'postName';
