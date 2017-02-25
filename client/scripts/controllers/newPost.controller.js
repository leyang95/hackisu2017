import {_} from 'meteor/underscore';
import {Meteor} from 'meteor/meteor';
import {Controller} from 'angular-ecmascript/module-helpers';
import {Posts, Messages} from '../../../lib/collections';

export default class NewPostCtrl extends Controller {
    constructor() {
        super(...arguments);

        this.picture = this.$state.params.picture;
        if (_.isEmpty(this.picture)) {
            this.picture = "https://samples.clarifai.com/food.jpg";
        }
        this.subscribe('users');
    }

    confirm() {
        if (_.isEmpty(this.picture)) return;
        this.newPost({
            userId: this.currentUserId,
            picture: this.picture,
            caption: this.caption,
        });
    }

    newPost(data) {
        this.callMethod('newPost', data, (err, postId) => {
            if (err) return this.handleError(err);
            this.$state.go('tab.posts');
        });
    }

    handleError(err) {
        this.$log.error('New post creation error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'New post creation failed',
            template: 'Please try again',
            okType: 'button-positive button-clear'
        });
    }
}

NewPostCtrl.$name = 'NewPostCtrl';
NewPostCtrl.$inject = ['$state', '$ionicPopup', '$log'];
