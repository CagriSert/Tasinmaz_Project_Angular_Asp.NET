import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient,HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder,private http:HttpClient) { }
  readonly BaseURI='https://localhost:5001/api';
  
  boslukKontrolHataMessage='Bu alan zorunludur.';
  sifreKarakterSayiKontrolHataMessage='Şifreniz en az, 8 karakter, 1 özel, 1 rakam, 1 büyük harf içermelidir.';
  sifreEslesmeKontrolHataMessage='Şifreler Eşleşmiyor.';

  formModel = this.fb.group({
    Email:['',[Validators.required,Validators.email]],
    Name:['',Validators.required],
    LastName:['',Validators.required],
    Roles: [''],
    Passwords : this.fb.group({
      Password:['',[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&].{8,}')]],
      ConfirmPassword:['',Validators.required]
  },{validator:this.comparePasswords})
});
comparePasswords(fb: FormGroup){
  let confirmPswrdCtrl = fb.get('ConfirmPassword');
  if(confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors){
    if(fb.get('Password').value != confirmPswrdCtrl.value)
      confirmPswrdCtrl.setErrors({passwordMismatch:true});
    else
      confirmPswrdCtrl.setErrors(null);
  }
}
Register(){
  var body={
    rolId:this.formModel.value.Roles,
    name:this.formModel.value.Name,
    lastName:this.formModel.value.LastName,
    mail:this.formModel.value.Email,
    password:this.formModel.value.Passwords.Password 
  };
  return this.http.post(this.BaseURI+'/Users/Register',body);
  

}

  GetRoles(){
    return this.http.get(this.BaseURI+'/Users/Roles').pipe( );
  }

  Login(formData) {
    console.log(formData);
    return this.http.post(this.BaseURI+'/Users/Login',formData);
  }

  GetUserProfile(){
    var tokenHeader = new HttpHeaders({'Authorization':'Bearer '+localStorage.getItem('token')})
    return this.http.get(this.BaseURI+'/UserProfile',{headers:tokenHeader});
  }

  totalLength:any;
  page:number = 1;
  users:[]
  GetUsers(){
    return this.http.get(this.BaseURI+'/Users').subscribe((result:any)=>{
      this.users = result;
      this.totalLength = result.length;

    });
    
  }

  DeleteUser(id:Number){
    return this.http.delete(this.BaseURI+'/Users/Delete/' + id );
  }
}
