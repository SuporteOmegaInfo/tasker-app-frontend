import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './pages/auth/shared/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    // canActivate: [],
    loadChildren: () =>
      import('./pages/auth/auth.module').then(
        (mod) => mod.AuthModule
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/client/dashboard/dashboard.module').then(
        (mod) => mod.DashboardModule
      ),
  },
  {
    path: 'permissions',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/adm/permissions/permissions.module').then(
        (mod) => mod.PermissionsModule
      ),
  },
  {
    path: 'departments',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/adm/departments/departments.module').then(
        (mod) => mod.DepartmentsModule
      ),
  },
  {
    path: 'positions',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/adm/positions/positions.module').then(
        (mod) => mod.PositionsModule
      ),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/adm/users/users.module').then(
        (mod) => mod.UsersModule
      ),
  },
  {
    path: 'companies',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/adm/companies/companies.module').then(
        (mod) => mod.CompaniesModule
      ),
  },
  {
    path: 'projects',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/client/projects/projects.module').then(
        (mod) => mod.ProjectsModule
      ),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
