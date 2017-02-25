import { Mongo } from 'meteor/mongo';

export const Posts = new Mongo.Collection('posts');
export const Messages = new Mongo.Collection('messages');

Posts.allow({
    'insert': function (obj) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});