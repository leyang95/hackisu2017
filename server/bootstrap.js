import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Posts} from '../lib/collections.js';

Meteor.startup(function () {
    if (Meteor.users.find().count() != 0) return;

    Accounts.createUserWithPhone({
        phone: '+972501234567',
        profile: {
            name: 'My friend 1'
        }
    });

    Accounts.createUserWithPhone({
        phone: '+972501234568',
        profile: {
            name: 'My friend 2'
        }
    });

    Accounts.createUserWithPhone({
        phone: '+972501234569',
        profile: {
            name: 'My friend 3'
        }
    });

    Posts.insert({
        postId: "JzkTuutuWAyaNyn2H",
        name: "Food 1",
        imageData: "https://samples.clarifai.com/food.jpg",
        description: "Tasty food.",
        concepts: ["sauce", "rice", "beef"]
    });
});