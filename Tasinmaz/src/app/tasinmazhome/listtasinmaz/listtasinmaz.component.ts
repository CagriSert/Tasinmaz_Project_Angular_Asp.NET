import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';

@Component({
  selector: 'app-listtasinmaz',
  templateUrl: './listtasinmaz.component.html',
  styles: []
})
export class ListtasinmazComponent implements OnInit {

  constructor(private fb:FormBuilder,private service:TasinmazService,private router:Router,private toastr: ToastrService) { }
  citiesList:{};
  districts:{};
  neighbourhoods:{};
  
  totalLength:any;
  page:number = 1;
  ngOnInit() {
    this.service.GetTasinmaz();
    this.service.GetSingleCities();
  }
  OnDelete(id:Number)
  {
    this.service.DeleteTasinmaz(id).subscribe(res=>{
      this.toastr.warning("Kayıt başarılı bir şekilde silindi","Uyarı!!"),
      this.service.GetTasinmaz()
    });
  }
  GetCities(){
    
   // console.log(this.service.tasinmazIlId);
    // this.service.getSingleCities(ilId).subscribe(res=>{
      // res=>this.citiesList=res
    // });
    
    
    
    
  }

  OnLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
  OnTasinmazEkle(){
    this.router.navigate(['/tasinmazhome/addtasinmaz']);
  }

  GetKullanicilarPage(){
    this.router.navigate(['/user/listuser']);
  }
  GetTasinmazlarPage(){
    this.router.navigate(['/tasinmazhome/listtasinmaz']);
  }
}
