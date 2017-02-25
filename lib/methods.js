import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Posts, Messages} from '../lib/collections';

var Clarifai = require('clarifai');
// instantiate a new Clarifai app passing in your clientId and clientSecret

var app = new Clarifai.App(
    'D5gWH1CQTaJJB3qBL4E5CkNAmbwd5BCcyOsbsdmO',
    'aoB-A1p3_WrBphjs3XMYSJN85zJfcijj403RQ7Di'
);

Meteor.methods({
    predictImage(image){
        return app.models.predict(Clarifai.GENERAL_MODEL, image).then(
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
        Posts.update(message.postId, {$set: {lastMessage: message}});

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
    newPost(otherId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to create a post.');
        }

        check(otherId, String);
        const otherUser = Meteor.users.findOne(otherId);

        if (!otherUser) {
            throw new Meteor.Error('user-not-exists',
                'Post\'s user not exists');
        }

        const post = {
            userIds: [this.userId, otherId],
            createdAt: new Date()
        };

        const postId = Posts.insert(post);

        return postId;
    },
    removePost(postId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to remove a post.');
        }

        check(postId, String);

        const post = Posts.findOne(postId);

        if (!post || !_.include(post.userIds, this.userId)) {
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
