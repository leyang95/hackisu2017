import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';

export default class PostPictureFilter extends Filter {
  filter(post) {
    if (!post) return;

    return post.picture;
  };
}

PostPictureFilter.$name = 'postPicture';
