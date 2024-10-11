import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PasswordRequestComponent } from './password-request/password-request.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'request-password', component: PasswordRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
