import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms'
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './user/login/login.component';
import { TasinmazhomeComponent } from './tasinmazhome/tasinmazhome.component';
import { AddtasinmazComponent } from './tasinmazhome/addtasinmaz/addtasinmaz.component';
import { ListtasinmazComponent } from './tasinmazhome/listtasinmaz/listtasinmaz.component';
import { UpdatetasinmazComponent } from './tasinmazhome/updatetasinmaz/updatetasinmaz.component';

import {NgxPaginationModule} from 'ngx-pagination';
import { ListuserComponent } from './user/listuser/listuser.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    TasinmazhomeComponent,
    AddtasinmazComponent,
    ListtasinmazComponent,
    UpdatetasinmazComponent,
    ListuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      progressBar:true
    }),
    FormsModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]

})
export class AppModule { }
