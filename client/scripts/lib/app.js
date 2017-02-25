// Libs
import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import {Meteor} from 'meteor/meteor';

// Modules
import CameraCtrl from '../controllers/camera.controller';
import PostsCtrl from '../controllers/posts.controller';
import PostCtrl from '../controllers/post.controller';
import ConfirmationCtrl from '../controllers/confirmation.controller';
import LoginCtrl from '../controllers/login.controller';
import NewPostCtrl from '../controllers/newPost.controller';
import ProfileCtrl from '../controllers/profile.controller';
import SettingsCtrl from '../controllers/settings.controller';
import InputDirective from '../directives/input.directive';
import CalendarFilter from '../filters/calendar.filter';
import PostNameFilter from '../filters/post-name.filter';
import PostPictureFilter from '../filters/post-picture.filter';
import NewPostService from '../services/new-post.service';
import Routes from '../routes';

const App = 'Whatsapp';

// App
Angular.module(App, [
    'angular-meteor',
    'angular-meteor.auth',
    'angularMoment',
    'ionic'
]);

new Loader(App)
    .load(CameraCtrl)
    .load(PostsCtrl)
    .load(PostCtrl)
    .load(ConfirmationCtrl)
    .load(LoginCtrl)
    .load(NewPostCtrl)
    .load(ProfileCtrl)
    .load(SettingsCtrl)
    .load(InputDirective)
    .load(CalendarFilter)
    .load(PostNameFilter)
    .load(PostPictureFilter)
    .load(NewPostService)
    .load(Routes);

// Startup
if (Meteor.isCordova) {
    Angular.element(document).on('deviceready', onReady);
}
else {
    Angular.element(document).ready(onReady);
}

function onReady() {
    Angular.bootstrap(document, [App]);
}
