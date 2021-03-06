import { _ } from 'meteor/underscore';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

import searchTemplateUrl from '../templates/search.html';
import homeTemplateUrl from '../templates/home.html';
import newPostTemplateUrl from '../templates/newPost.html';
import postTemplateUrl from '../templates/post.html';
import postsTemplateUrl from '../templates/posts.html';
import confirmationTemplateUrl from '../templates/confirmation.html';
import loginTemplateUrl from '../templates/login.html';
import profileTemplateUrl from '../templates/profile.html';
import settingsTemplateUrl from '../templates/settings.html';
import tabsTemplateUrl from '../templates/tabs.html';

class RoutesConfig extends Config {
  constructor() {
    super(...arguments);

    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
  }

  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl,
        controller: 'CameraCtrl as camera',
        resolve: {
          user: this.isAuthorized,
          posts() {
            return Meteor.subscribe('posts');
          }
        }
      })
      .state('tab.posts', {
        url: '/posts',
        views: {
          'tab-posts': {
            templateUrl: postsTemplateUrl,
            controller: 'PostsCtrl as posts'
          }
        }
      })
      .state('tab.post', {
        url: '/posts/:postId',
        views: {
          'tab-posts': {
            templateUrl: postTemplateUrl,
            controller: 'PostCtrl as post'
          }
        }
      })
      .state('tab.camera', {
        url: '/camera',
        views: {
          'tab-camera': {
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: loginTemplateUrl,
        controller: 'LoginCtrl as logger'
      })
      .state('confirmation', {
        url: '/confirmation/:phone',
        templateUrl: confirmationTemplateUrl,
        controller: 'ConfirmationCtrl as confirmation'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: profileTemplateUrl,
        controller: 'ProfileCtrl as profile',
        resolve: {
          user: this.isAuthorized
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: settingsTemplateUrl,
            controller: 'SettingsCtrl as settings',
          }
        }
      })
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: homeTemplateUrl,
            controller: 'HomeCtrl as home',
          }
        }
      })
      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: searchTemplateUrl,
            controller: 'SearchCtrl as search',
          }
        }, resolve : {
          users() {
            return Meteor.subscribe('users');
          }
        }
      })
      .state('newPost', {
        url: '/newPost',
        templateUrl: newPostTemplateUrl,
        controller: 'NewPostCtrl as newPost',
        params: {picture: null}
      });

    this.$urlRouterProvider.otherwise('tab/home');
  }

  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);

      if (err === 'AUTH_REQUIRED') {
        this.$state.go('login');
      }
    });
  }
}

RoutesRunner.$inject = ['$rootScope', '$state'];

export default [RoutesConfig, RoutesRunner];
