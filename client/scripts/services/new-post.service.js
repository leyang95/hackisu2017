import { Service } from 'angular-ecmascript/module-helpers';

import newPostTemplateUrl from '../../templates/new-post.html';

export default class NewPostService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = newPostTemplateUrl;
  }

  showModal() {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
    });
  }

  hideModal() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

NewPostService.$name = 'NewPost';
NewPostService.$inject = ['$rootScope', '$ionicModal'];