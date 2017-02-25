import { Meteor } from 'meteor/meteor';
import { Posts, Messages } from '../lib/collections';

Meteor.publish('users', function(){
  return Meteor.users.find({}, { fields: {profile : 1}});
});

Meteor.publishComposite('posts', function(){
  if(!this.userId) return;

  return {
    find(){
      return Posts.find({ userId: this.userId });
    },
    children: [
      {
        find(post){
          return Messages.find({ postId: post._id });
        }
      },
      {
        find(post){
          const query = { _id: { $eq: post.userId }};
          const options = { fields: { profile: 1 }};

          return Meteor.users.find(query, options);
        }
      }
    ]
  }
})
