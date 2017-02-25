import { Mongo } from 'meteor/mongo';

export const Posts = new Mongo.Collection('posts');
export const Messages = new Mongo.Collection('messages');