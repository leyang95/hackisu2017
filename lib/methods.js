import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Posts, Messages} from '../lib/collections';
import {HTTP} from 'meteor/http'

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
        message.username = Meteor.user().username;

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

        var picture = data.picture;
        picture = picture.substring(picture.lastIndexOf(",") + 1, picture.length);

        app.models.predict(Clarifai.FOOD_MODEL, {base64: picture}).then(
            function (response) {
                var concs = response.outputs[0].data.concepts;

                var ingredients = [];
                for(var i = 0; i < concs.length; i++){
                    ingredients.push(concs[i].name);
                }

                Meteor.call('getNutrient', ingredients, function (err, res) {
                    if (err)
                        console.log(err);
                    else {
                        var foods = res.foods;
                        var nutrientInfo = {};

                        for(var i = 0; i < foods.length; i++){
                            nutrientInfo[foods[i].food_name] = {
                                "food_name": foods[i].food_name,
                                "serving_weight_grams": foods[i].serving_weight_grams,
                                "nf_calories": foods[i].nf_calories,
                                "nf_total_fat": foods[i].nf_total_fat,
                                "nf_saturated_fat": foods[i].nf_saturated_fat,
                                "nf_protein": foods[i].nf_protein,
                                "thumb" : foods[i].photo.thumb
                            }
                        }

                        const post = {
                            userId: data.userId,
                            picture: data.picture,
                            caption: data.caption,
                            concepts: response.outputs[0].data.concepts,
                            nutrients: nutrientInfo,
                            createdAt: new Date()
                        };

                        return Posts.insert(post);
                    }
                });

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
    },
    getNutrient(concept) {
        const data = {
            "query": concept.join('\n'),
            "timezone": "US/Eastern"
        };
        const header = {
            "x-app-id": "a39623fb",
            "x-app-key": "68c42164698448076c2887d260d2debc",
            "x-remote-user-id": "0"
        };

        try {
            this.unblock();
            var nutrient = HTTP.call("POST", "https://trackapi.nutritionix.com/v2/natural/nutrients", {
                headers: header,
                data: data
            });
            return nutrient.data;
        } catch (err) {
            console.log(err);
        }
    }
});
