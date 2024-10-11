import { NgModule } from '@angular/core';

import { SharedModule } from '../../kernel/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { PasswordRequestComponent } from './password-request/password-request.component';

@NgModule({
  declarations: [
    LoginComponent,
    PasswordRequestComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
