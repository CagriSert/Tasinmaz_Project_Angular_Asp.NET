import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';

@Component({
  selector: 'app-addtasinmaz',
  templateUrl: './addtasinmaz.component.html',
  styles: []
})
export class AddtasinmazComponent implements OnInit {

  boslukKontrolHataMessage='Bu alan zorunludur.';

  cities:{};
  districts:{};
  neighbourhoods:{};
  
  
  constructor(public service : TasinmazService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.service.GetCities().subscribe(
      data => this.cities=data 
    );
  }
  onChangeCitiy(citiyId: Number){
    if(citiyId){
      this.service.GetDistricts(citiyId).subscribe(
          data => {
            this.service.formModel.controls.Districts.enable();
            this.districts = data;
            this.neighbourhoods = null;
          }
      );
    }else{
      this.service.formModel.controls.Districts.disable();
      this.service.formModel.controls.Neighbourhoods.disable();
      this.districts=null;
      this.neighbourhoods=null;
    }
 }
  OnChangeDistricts(cityId: Number){
    if(cityId){
      this.service.GetNeighbourhood(cityId).subscribe(
          data => {
            this.service.formModel.controls.Neighbourhoods.enable();
            this.neighbourhoods = data;
          }
      );
    }else{
      this.service.formModel.controls.Neighbourhoods.disable();
      this.neighbourhoods=null;
    }
 }
 OnlyNumbersAlowed(event):boolean{
  const charCode = (event.which)?event.which:event.keyCode;
  if(charCode>31 && (charCode<48 || charCode>57)){
    this.toastr.warning('Lütfen Numara girdiğinize emin olun','Uyarı!!')
    return false;
  }

  return true;
 }
 OnSubmit(){
    this.service.BtnTasinmazEkle().subscribe(
      (res: any)=>{
          this.service.formModel.reset()
          this.toastr.success('Yeni Taşınmaz başarılı bir şekilde oluşturuldu!','Kayıt Başarılı.'),
          this.service.formModel.controls.Districts.disable(),
          this.service.formModel.controls.Neighbourhoods.disable(),
          this.neighbourhoods=null,this.districts=null
          console.log(this.neighbourhoods);
        });        
  }
  OntasinmazEkleCikis(){
    this.router.navigate(['/tasinmazhome/listtasinmaz']);
  }
}
  