import { authGuard, permissionGuard } from '@abp/ng.core';
import { Routes } from '@angular/router';


export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(c => c.createRoutes()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(c => c.createRoutes()),
  },
  {
    path: 'tenant-management',
    loadChildren: () => import('@abp/ng.tenant-management').then(c => c.createRoutes()),
  },
  {
    path: 'setting-management',
    loadChildren: () => import('@abp/ng.setting-management').then(c => c.createRoutes()),
  },
  {
    path: 'question',
    canActivate: [authGuard],
    children: [
      {
        path: '', // Khớp với đường dẫn /question
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list', // Khớp với đường dẫn /question
        loadComponent: () => import('./question/question-table/question-table').then(c => c.QuestionTable)
      },
      {
        path: 'create',
        loadComponent: () => import('./question/question-create/question-create').then(c => c.QuestionCreate)
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./question/question-detail/question-detail').then(c => c.QuestionDetail)
      },
    ],
  },
];
