import { RoutesService, eLayoutType } from '@abp/ng.core';
import { inject, provideAppInitializer } from '@angular/core';
import { ConfigStateService } from '@abp/ng.core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);
  const configState = inject(ConfigStateService);

  // Home - hiển thị chung cho mọi người
  routes.add([
    {
      path: '/',
      name: '::Menu:Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application,
    },
  ]);

  // Các route Question - chỉ role User mới thấy
  let questionRoutesAdded = false;
  configState.getOne$('currentUser').subscribe(currentUser => {
    const u = currentUser as { roles?: string[] } | null | undefined;
    const roles = Array.isArray(u?.roles) ? u.roles : [];
    const hasUserRole = roles.includes('User');

    if (hasUserRole && !questionRoutesAdded) {
      questionRoutesAdded = true;
      routes.add([
        {
          path: '/question',
          name: 'Questions',
          iconClass: 'fas fa-question-circle',
          order: 2,
          layout: eLayoutType.application,
        },
        {
          path: '/question/list',
          name: 'All Questions',
          parentName: 'Questions',
          iconClass: 'fas fa-clipboard-list',
          order: 1,
          layout: eLayoutType.application,
        },
        {
          path: '/question/history',
          name: 'History',
          parentName: 'Questions',
          iconClass: 'fas fa-history',
          order: 2,
          layout: eLayoutType.application,
        },
        {
          path: '/question/create',
          name: 'Create Question',
          parentName: 'Questions',
          iconClass: 'fas fa-plus-circle',
          order: 3,
          layout: eLayoutType.application,
        },
      ]);
    }
  });
}
