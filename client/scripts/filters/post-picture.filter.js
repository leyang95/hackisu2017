import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';

export default class PostPictureFilter extends Filter {
  filter(post) {
    if (!post) return;

    let otherId = _.without(post.userIds, Meteor.userId())[0];
    let otherUser = Meteor.users.findOne(otherId);
    let hasPicture = otherUser && otherUser.profile && otherUser.profile.picture;

    return hasPicture ? otherUser.profile.picture : post.picture || '/user-default.svg';
  };
}

PostPictureFilter.$name = 'postPicture';