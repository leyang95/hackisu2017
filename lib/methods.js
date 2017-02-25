import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Chats, Messages} from '../lib/collections';

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
    newPost(message) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }

        check(message, Match.OneOf(
            {
                type: String,
                text: String,
                chatId: String
            },
            {
                picture: String,
                type: String,
                chatId: String
            }
        ));

        message.timestamp = new Date();
        message.userId = this.userId;

        const messageId = Messages.insert(message);
        Chats.update(message.chatId, {$set: {lastMessage: message}});

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
    newChat(otherId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to create a chat.');
        }

        check(otherId, String);
        const otherUser = Meteor.users.findOne(otherId);

        if (!otherUser) {
            throw new Meteor.Error('user-not-exists',
                'Chat\'s user not exists');
        }

        const chat = {
            userIds: [this.userId, otherId],
            createdAt: new Date()
        };

        const chatId = Chats.insert(chat);

        return chatId;
    },
    removeChat(chatId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to remove a chat.');
        }

        check(chatId, String);

        const chat = Chats.findOne(chatId);

        if (!chat || !_.include(chat.userIds, this.userId)) {
            throw new Meteor.Error('chat-not-exists',
                'Chat not exists');
        }

        Messages.remove({chatId: chatId});

        return Chats.remove({_id: chatId});
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
