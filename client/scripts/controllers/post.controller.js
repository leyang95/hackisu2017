import Ionic from 'ionic-scripts';
import {_} from 'meteor/underscore';
import {Meteor} from 'meteor/meteor';
import {MeteorCameraUI} from 'meteor/supaseca:camera-ui';
import {Controller} from 'angular-ecmascript/module-helpers';
import {Posts, Messages} from '../../../lib/collections';

export default class PostCtrl extends Controller {
    constructor() {
        super(...arguments);

        this.postId = this.$stateParams.postId;
        this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
        this.isCordova = Meteor.isCordova;

        this.helpers({
            messages() {
                return Messages.find({postId: this.postId});
            },
            data() {
                return Posts.findOne(this.postId);
            },
            user(){
                return this.currentUser.username;
            },
            userId(){
                return Meteor.userId();
            }
        });
    }

    showNutrientInfo(food) {
        var post = Posts.findOne(this.postId);
        var nutrient = post.nutrients[food];
        if (typeof nutrient != 'undefined') {
            var template = "<div class='nutrientPopUp'><div class='nutrientImg'><img class='img-responsive' src='" + nutrient["thumb"] + "'></div><div>Food: " + nutrient["food_name"] + "</div><div>Serving size: " + nutrient["serving_weight_grams"] + " g</div>" + "<div>Calories: " + nutrient["nf_calories"] + " kCal</div><div>Total fat: " + nutrient["nf_total_fat"] + " g</div><div>Protein: " + nutrient["nf_protein"] + " g</div></div>";

            this.$ionicPopup.alert({
                title: "<span class='nutrientTitle'>Nutrition Facts</span>",
                template: template,
                oktype: 'button-positive'
            });
        }
    }

    sendMessage() {
        if (_.isEmpty(this.message)) return;

        this.callMethod('newMessage', {
            text: this.message,
            type: 'text',
            postId: this.postId
        });

        delete this.message;
    }

    removePost() {
        this.callMethod('removePost', this.postId, (err) => {
            if (err) return this.handleError(err);
            this.$state.go('tab.posts');
        });
    }

    sendPicture() {
        MeteorCameraUI.getPicture({}, (err, data) => {
            if (err) return this.handleError(err);

            this.callMethod('newMessage', {
                picture: data,
                type: 'picture',
                postId: this.postId
            });
        });
    }

    inputUp() {
        if (this.isIOS) {
            this.keyboardHeight = 216;
        }

        this.scrollBottom(true);
    }

    inputDown() {
        if (this.isIOS) {
            this.keyboardHeight = 0;
        }

        this.$ionicScrollDelegate.$getByHandle('postScroll').resize();
    }

    closeKeyboard() {
        if (this.isCordova) {
            cordova.plugins.Keyboard.close();
        }
    }

    autoScroll() {
        let recentMessagesNum = this.messages.length;

        this.autorun(() => {
            const currMessagesNum = this.getCollectionReactively('messages').length;
            const animate = recentMessagesNum != currMessagesNum;
            recentMessagesNum = currMessagesNum;
            this.scrollBottom(animate);
        });
    }

    scrollBottom(animate) {
        this.$timeout(() => {
            this.$ionicScrollDelegate.$getByHandle('postScroll').scrollBottom(animate);
        }, 300);
    }

    handleError(err) {
        if (err.error == 'cancel') return;
        this.$log.error('Profile save error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'Save failed',
            template: 'Please try again',
            oktype: 'button-positive button-clear'
        });
    }
}

PostCtrl.$name = 'PostCtrl';
PostCtrl.$inject = ['$state', '$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
