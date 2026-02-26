//  src/app/identity-extended/identity-extended.routes.ts

import { Routes } from '@angular/router';
import { IdentityExtendedComponent } from './identity-extended';
import { identityEntityActionContributors } from './identityEntityActionContributors';

export const createExtendedIdentityRoutes = (): Routes => [
  {
    path: '',
    component: IdentityExtendedComponent,
    providers: [
      // Thêm dòng này để các component con (UsersComponent) 
      // có thể inject được IdentityExtendedComponent
      IdentityExtendedComponent 
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@abp/ng.identity').then(c =>
            c.createRoutes({
              entityActionContributors: identityEntityActionContributors,
            }),
          ),
      },
    ],
  },
];
