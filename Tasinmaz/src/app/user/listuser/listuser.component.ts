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
  searchData:any;
  

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
      rolesListUser:[''],
      password:['',[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&].{8,}')]],
    });
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
    if(confirm(id + "Kaydı Silmek istediğinize eminmisiniz??"))
    {
    this.service.DeleteUser(id).subscribe(res=>{
      this.toastr.success("Kayıt başarılı bir şekilde silindi","Uyarı!!"),
      this.service.GetUsers();
    });
  }
  }
  
  OnEdit(item:any){
    this.formValue.reset();
    this.userModelObj.id = item.id;
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
  GetLogPage(){
    this.router.navigate(['/log/loglist']);
  }

  UpateUser(){
    if(confirm("Kaydı Güncellemek istediğinize eminmisiniz??"))
  {
    this.userModelObj.rolId = this.formValue.value.rolesListUser;
    this.userModelObj.name = this.formValue.value.firstName;
    this.userModelObj.lastName = this.formValue.value.lastName;
    this.userModelObj.mail = this.formValue.value.email;
    this.userModelObj.password = this.formValue.value.password;
    console.log(this.userModelObj);
    this.service.UpdateUserDatabase(this.userModelObj,this.userModelObj.id)
    .subscribe(res=>{
      this.toastr.success("Kayıt Başarılı bir Şekilde Güncellendi");
      let ref = document.getElementById('cancel')
      ref.click();
      this.formValue.reset();
      this.service.GetUsers();
    })
  }
}
}
