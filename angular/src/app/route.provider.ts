import { RoutesService, eLayoutType } from '@abp/ng.core';
import { inject, provideAppInitializer } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);
  routes.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '',
        name: 'Question',
        iconClass: 'fas fa-question-circle',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/question-table',
        name: 'All Questions',
        parentName: 'Question',
        iconClass: 'fas fa-comments',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/question-create',
        name: 'Create Question',
        parentName: 'Question',
        iconClass: 'fas fa-plus-circle',
        order: 2,
        layout: eLayoutType.application,
      },
  ]);

}
