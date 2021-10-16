import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  formModel = {
    Email:'',
    Password:''
  }

  constructor(private service:UserService, private router:Router, private toastr: ToastrService ) { }

  ngOnInit() {
    if(localStorage.getItem('token') != null)
      this.router.navigateByUrl('/tasinmazhome/listtasinmaz');
  }
  OnSubmit(form:NgForm){
    this.service.Login(form.value).subscribe(
      (res:any)=>{
        localStorage.setItem('token',res.token);
        console.log(res.token);
        this.router.navigateByUrl('/tasinmazhome/listtasinmaz')
      },
      err=>{
        if(err.status == 400||err.status == 500){
          this.toastr.error('Mail veya şifre hatalı!','Hatalı Giriş');
        }
        else
        console.log(err);
      }
    );
  }
}
