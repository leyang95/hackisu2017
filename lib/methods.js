import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Posts, Messages} from '../lib/collections';

export const Clarifai = require('clarifai');
// instantiate a new Clarifai app passing in your clientId and clientSecret

export const app = new Clarifai.App(
    'D5gWH1CQTaJJB3qBL4E5CkNAmbwd5BCcyOsbsdmO',
    'aoB-A1p3_WrBphjs3XMYSJN85zJfcijj403RQ7Di'
);

Meteor.methods({
    predictImage(image){
        return app.models.predict(Clarifai.FOOD_MODEL, image).then(
            function (response) {
                // do something with response
                concepts = response.outputs[0].data.concepts;
                return concepts;
            },
            function (err) {
                // there was an error
                console.log(err);
            }
        );
    },
    newMessage(message) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }

        // check(message, Match.OneOf(
        //     {
        //         type: String,
        //         text: String,
        //         postId: String
        //     },
        //     {
        //         picture: String,
        //         type: String,
        //         postId: String
        //     }
        // ));

        message.timestamp = new Date();
        message.userId = this.userId;

        const messageId = Messages.insert(message);

        return messageId;
    },
    updateName(name) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update his name.');
        }

        check(name, String);

        if (name.length === 0) {
            throw Meteor.Error('name-required', 'Must provide a user name');
        }

        return Meteor.users.update(this.userId, {$set: {'profile.name': name}});
    },
    newFriend(friendId) {
      if(!this.userId){
        throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his name.');
      }

      return Meteor.users.update({_id: this.userId}, {$push: {'profile.friendIds': friendId}});
    },
    removeFriend(friendId) {
      if(!this.userId){
        throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his name.');
      }

      return Meteor.users.update({_id: this.userId}, {$pull: {'profile.friendIds': friendId}});
    },
    newPost(data) {
        if (this.data && !this.data.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to create a post.');
        }

        // check(data, {
        //     userId: String,
        //     picture: String,
        //     caption: Match.Maybe(String)
        // });

        app.models.predict(Clarifai.FOOD_MODEL, data.picture).then(
            function (response) {
                // do something with response
                const post = {
                    userId: data.userId,
                    picture: data.picture,
                    caption: data.caption,
                    concepts: response.outputs[0].data.concepts,
                    createdAt: new Date()
                };

                return Posts.insert(post);
            },
            function (err) {
                // there was an error
                console.log(err);
            }
        );
    },
    removePost(postId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to remove a post.');
        }

        check(postId, String);

        const post = Posts.findOne(postId);

        if (!post) {
            throw new Meteor.Error('post-not-exists',
                'Post not exists');
        }

        Messages.remove({postId: postId});
        return Posts.remove({_id: postId});
    },
    updatePicture(data){
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update his picture.');
        }

        check(data, String);

        return Meteor.users.update(this.userId, {$set: {'profile.picture': data}});
    }
});
