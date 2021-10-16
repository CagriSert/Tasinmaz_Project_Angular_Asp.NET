import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AddtasinmazComponent } from './tasinmazhome/addtasinmaz/addtasinmaz.component';
import { ListtasinmazComponent } from './tasinmazhome/listtasinmaz/listtasinmaz.component';
import { TasinmazhomeComponent } from './tasinmazhome/tasinmazhome.component';
import { UpdatetasinmazComponent } from './tasinmazhome/updatetasinmaz/updatetasinmaz.component';
import { ListuserComponent } from './user/listuser/listuser.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:'', redirectTo:'/user/login',pathMatch:'full'},
  {
   path:'user',component:UserComponent,
   children:[
     {path:'registration',component:RegistrationComponent,canActivate:[AuthGuard]},
     {path:'login',component:LoginComponent},
     {path:'listuser',component:ListuserComponent,canActivate:[AuthGuard]}
  ]},
  {
    path:'tasinmazhome',component:TasinmazhomeComponent,
    children:[
      {path:'addtasinmaz',component:AddtasinmazComponent,canActivate:[AuthGuard]},
      {path:'listtasinmaz',component:ListtasinmazComponent,canActivate:[AuthGuard]},
      {path:'updatetasinmaz',component:UpdatetasinmazComponent,canActivate:[AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
