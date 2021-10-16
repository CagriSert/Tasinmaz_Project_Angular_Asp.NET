import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';
import { UserModel } from '../user-model board.model';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styles: []
})
export class ListuserComponent implements OnInit {

  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  

  constructor(private formBuilder:FormBuilder,
    private service:UserService,
    private router:Router,
    private toastr: ToastrService) { }

  totalLength:any;
  page:number = 1;
  roles:{};

  ngOnInit() {

    this.service.GetRoles().subscribe(
      data => this.roles=data 
    );
    this.service.GetUsers();
    this.formValue = this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      rolesListUser:['',[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&].{8,}')]],
      // passwords : this.formBuilder.group({
      //   password:['',[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&].{8,}')]],
      //   confirmPassword:['',Validators.required]
      // },{validator:this.comparePasswords})
    });
  }
  comparePasswords(fodmBuilder: FormGroup){
    let confirmPswrdCtrl = this.formValue.get('confirmPassword');
    if(confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors){
      if(this.formValue.get('password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({passwordMismatch:true});
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  OnLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
  OnKullaniciEkle(){
     this.router.navigate(['/user/registration']);
  }
  
  OnDelete(id:Number)
  {
    this.service.DeleteUser(id).subscribe(res=>{
      this.toastr.warning("Kayıt başarılı bir şekilde silindi","Uyarı!!"),
      this.service.GetUsers();
    });
  }
  
  OnEdit(item:any){
    this.formValue.controls['firstName'].setValue(item.name);
    this.formValue.controls['lastName'].setValue(item.lastName);
    this.formValue.controls['email'].setValue(item.mail);
    this.formValue.controls['rolesListUser'].setValue(item.rolId);
  }

  GetKullanicilarPage(){
    this.router.navigateByUrl('/users/listuser');
  }
  GetTasinmazlarPage(){
    this.router.navigateByUrl('/tasinmazhome/listtasinmaz');
  }
}
