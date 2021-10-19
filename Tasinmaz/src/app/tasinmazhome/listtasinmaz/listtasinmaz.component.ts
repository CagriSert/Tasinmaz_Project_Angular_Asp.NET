import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';
import { TasinmazModel } from '../Tasinmaz-model board.model';
import * as XLSX from 'xlsx';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { UserService } from 'src/app/shared/user.service';
import { fromLonLat, transform } from 'ol/proj';

@Component({
  selector: 'app-listtasinmaz',
  templateUrl: './listtasinmaz.component.html',
  styles: []
})
export class ListtasinmazComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,
    private service:TasinmazService,
    private router:Router,
    private toastr: ToastrService,
    private userService:UserService) { }

  citiesList:{};
  districts:{};
  neighbourhoods:{};
  formValueTasinmaz !: FormGroup;
  tasinmazModelObj : TasinmazModel = new TasinmazModel();
  fileName = 'TasinmazKayit.xlsx';
  map:Map;
  view:View;
  userDetails;


  
  totalLength:any;
  page:number = 1;
  ngOnInit() { 
    this.service.GetTasinmaz();
    this.service.GetCities().subscribe(
      data => this.citiesList=data 
    );

    this.formValueTasinmaz = this.formBuilder.group({
      cities: ['',Validators.required],
      districts: [{value:'',disabled:false}],
      neighbourhoods:[{value:'',disabled:false}],
      ada:['',Validators.required],
      parsel:['',Validators.required],
      nitelik:['',Validators.required]
    });
    this.IntilazeMap();
    
    this.userService.GetUserProfile().subscribe(
      res=>{
        this.userDetails = res;
        console.log(this.userDetails.rolId);
      },
      err=>{
        console.log(err);
      },
  );

  }
  IntilazeMap(){
    this.view = new View({
        center: [3876682.9740679907, 4746346.604388495],
        zoom: 6.5,
        minZoom:5.8
      });

    this.map = new Map({
     view:this.view,
      layers: [
        new Tile({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        }),
        }),
      ],
      target: 'ol-map'
    }); 
    
  }
  GetCoordinates(item){
    console.log(fromLonLat([item.xCoordinate,item.yCoordinate]));
    this.view.animate({
      center:fromLonLat([item.yCoordinate,item.xCoordinate]),
      zoom:17,
      duration:2000,
      easing: this.bounce
    });
  }
  bounce(t) {
    const s = 7.5625;
    const p = 2.75;
    let l;
    if (t < 1 / p) {
      l = s * t * t;
    } else {
      if (t < 2 / p) {
        t -= 1.5 / p;
        l = s * t * t + 0.75;
      } else {
        if (t < 2.5 / p) {
          t -= 2.25 / p;
          l = s * t * t + 0.9375;
        } else {
          t -= 2.625 / p;
          l = s * t * t + 0.984375;
        }
      }
    }
    return l;
  }
  
  OnChangeCitiy(citiyId: Number){
    if(citiyId){
      this.service.GetDistricts(citiyId).subscribe(
          data => {
            this.formValueTasinmaz.controls.districts.enable();
            this.districts = data;
            this.neighbourhoods = null; 
          }
      );
    }else{
      this.formValueTasinmaz.controls.districts.disable();
      this.formValueTasinmaz.controls.Neighbourhoods.disable();
      this.districts=null;
      this.neighbourhoods=null;
    }
 }
  OnChangeDistricts(cityId: Number){
    if(cityId){
      this.service.GetNeighbourhood(cityId).subscribe(
          data => {
            this.formValueTasinmaz.controls.neighbourhoods.enable();
            this.neighbourhoods = data;
          }
      );
    }else{
      this.formValueTasinmaz.controls.neighbourhoods.disable();
      this.neighbourhoods=null;
    }
 }

  OnDelete(id:Number)
  {
    this.service.DeleteTasinmaz(id).subscribe(res=>{
      this.toastr.warning("Kayıt başarılı bir şekilde silindi","Uyarı!!"),
      this.service.GetTasinmaz()
    });
  }
  OnEdit(item:any){
    this.formValueTasinmaz.reset();
    this.tasinmazModelObj.id = item.id;
    this.formValueTasinmaz.controls['cities'].setValue(item.ilId);
    this.service.GetDistricts(item.ilId).subscribe(
          data => {
            this.formValueTasinmaz.controls.districts.enable();
            this.districts = data;
            this.neighbourhoods = null; 
          }
      );
    this.formValueTasinmaz.controls['districts'].setValue(item.ilceId);
    this.service.GetNeighbourhood(item.ilceId).subscribe(
      data => {
        this.formValueTasinmaz.controls.neighbourhoods.enable();
        this.neighbourhoods = data;
      }
  );
    this.formValueTasinmaz.controls['neighbourhoods'].setValue(item.mahalleId);
    this.formValueTasinmaz.controls['ada'].setValue(item.ada);
    this.formValueTasinmaz.controls['parsel'].setValue(item.parsel);
    this.formValueTasinmaz.controls['nitelik'].setValue(item.nitelik);
  }

  UpateTasinmaz(){
    this.tasinmazModelObj.ilId = this.formValueTasinmaz.value.cities;
    this.tasinmazModelObj.ilceId = this.formValueTasinmaz.value.districts;
    this.tasinmazModelObj.mahalleId  = this.formValueTasinmaz.value.neighbourhoods;
    this.tasinmazModelObj.ada = Number(this.formValueTasinmaz.value.ada);
    this.tasinmazModelObj.parsel = Number(this.formValueTasinmaz.value.parsel);
    this.tasinmazModelObj.nitelik = this.formValueTasinmaz.value.nitelik;
    console.log(this.tasinmazModelObj);
    this.service.UpdateTasinimazDatabase(this.tasinmazModelObj,this.tasinmazModelObj.id)
    .subscribe(res=>{
      alert("Kayıt Başarılı bir Şekilde Güncellendi");
      let ref = document.getElementById('cancel')
      ref.click();
      this.formValueTasinmaz.reset();
      this.service.GetTasinmaz();
    })
  }
  GetCities(){
    
   // console.log(this.service.tasinmazIlId);
    // this.service.getSingleCities(ilId).subscribe(res=>{
      // res=>this.citiesList=res
    // });
  }
  OnlyNumbersAlowed(event):boolean{
    const charCode = (event.which)?event.which:event.keyCode;
    if(charCode>31 && (charCode<48 || charCode>57)){
      this.toastr.warning('Lütfen Numara girdiğinize emin olun','Uyarı!!')
      return false;
    }
  
    return true;
   }
  OnLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
  OnTasinmazEkle(){
    this.service.formModel.reset();
    this.router.navigate(['/tasinmazhome/addtasinmaz']);
  }

  GetKullanicilarPage(){
    this.router.navigate(['/user/listuser']);
  }
  GetTasinmazlarPage(){
    this.router.navigate(['/tasinmazhome/listtasinmaz']);
  }
  GetLogPage(){
    this.router.navigate(['/log/loglist']);
  }

  Exportexcel(){
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
  // Search(){
  //   if(this.searchValue==""){
  //     this.ngOnInit();
  //   }else{
  //     this.service.tasinmaz.filter(res=>{
  //       return res.
  //     });
  //   }
  // }
}
