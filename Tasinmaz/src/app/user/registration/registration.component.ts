import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {
  roles:{};
  
  constructor(public service : UserService,private toastr:ToastrService,private router:Router) { }
  ngOnInit() {
    this.service.formModel.reset();
    this.service.GetRoles().subscribe(
      data => this.roles=data 
    );

    
  }
  OnSubmit(){
    this.service.Register().subscribe(
      (res: any)=>{
          this.service.formModel.reset()
          this.toastr.success('Yeni kullanıcı başarılı bir şekilde oluşturuldu!','Kayıt Başarılı.')
        },
        err=>{
          if(err.status == 400){
            this.toastr.error('Bu Mail Adresine Tanımlı Bir hesap mevcut!','Hatalı Giriş');
          }
          else
          console.log(err);
        }
      );       
  }
  OnKullaniciEkleCikis(){
    this.router.navigate(['/user/listuser']);
  }
  
}
