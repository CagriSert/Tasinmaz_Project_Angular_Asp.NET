import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';
import { TasinmazModel } from '../Tasinmaz-model board.model';
import * as XLSX from 'xlsx';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WKT from 'ol/format/WKT';
import Tile from 'ol/layer/Tile';


import View from 'ol/View';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {Circle as CircleStyle} from 'ol/style';

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
  
  parsel:any;
  vector:any
  GetCoordinates(item){
  this.map.removeLayer(this.vector);

    var coor=[item.xCoordinate,item.yCoordinate];
    console.log(coor);

    var feature = new Feature({
      labelPoint: new Point(coor),
      name: 'My Polygon'
    });

    feature.setGeometryName('labelPoint');
      var point = feature.getGeometry();
      
      var format = new WKT(),
      wkt = format.writeGeometry(point);
      console.log(wkt.toString());
      this.service.GetParsel(wkt.toString()).subscribe(data => this.parsel=data);

     var formats = new WKT()

     var stt = [  new Style({
      stroke: new Stroke({
        color: 'red',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
    new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: 'orange',
        }),
      }),
    }),
  ];
  var featureGeo = formats.readFeature(this.parsel[0]["geomWkt"], {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });

  var sourr = new VectorSource({
   features: [featureGeo],
  });
  this.vector = new VectorLayer({
   source: sourr,style:stt
  });

    this.map.addLayer(this.vector);



    console.log([item.xCoordinate,item.yCoordinate]);
    this.view.animate({
      center:fromLonLat([item.xCoordinate,item.yCoordinate]),
      zoom:20,
      duration:4000,
    });
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
      this.formValueTasinmaz.controls.neighbourhoods.disable();
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
    if(confirm(id +" numaralı Kaydı Silmek istediğinize eminmisiniz??")) {
    {
        this.service.DeleteTasinmaz(id).subscribe(res=>{
      this.toastr.success("Kayıt başarılı bir şekilde silindi","Uyarı!!"),
      this.service.GetTasinmaz()
    });
  }
 }
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

    if(confirm("Kaydı Güncellemek istediğinize eminmisiniz??"))
  {
    this.tasinmazModelObj.ilId = this.formValueTasinmaz.value.cities;
    this.tasinmazModelObj.ilceId = this.formValueTasinmaz.value.districts;
    this.tasinmazModelObj.mahalleId  = this.formValueTasinmaz.value.neighbourhoods;
    this.tasinmazModelObj.ada = Number(this.formValueTasinmaz.value.ada);
    this.tasinmazModelObj.parsel = Number(this.formValueTasinmaz.value.parsel);
    this.tasinmazModelObj.nitelik = this.formValueTasinmaz.value.nitelik;
    console.log(this.tasinmazModelObj);
    this.service.UpdateTasinimazDatabase(this.tasinmazModelObj,this.tasinmazModelObj.id)
    .subscribe(res=>{
      this.toastr.success("Kayıt Başarılı bir Şekilde Güncellendi");
      let ref = document.getElementById('cancel')
      ref.click();
      this.formValueTasinmaz.reset();
      this.service.GetTasinmaz();
    })
  }
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
