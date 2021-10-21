import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {fromLonLat, transform}from 'ol/proj.js' 

@Component({
  selector: 'app-addtasinmaz',
  templateUrl: './addtasinmaz.component.html',
  styles: []
})
export class AddtasinmazComponent implements OnInit {


  cities:{};
  districts:{};
  neighbourhoods:{};
  map:Map;
  view:View;
  xCoordinate:number;
  yCoordinate:number;
  
  constructor(public service : TasinmazService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.service.GetCities().subscribe(
      data => this.cities=data 
    );
    this.IntilazeMap();
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
  getCoord(event: any){
    if(confirm("Koordinatı Almak istediğinize eminmisiniz??")) {
       var coordinate = this.map.getEventCoordinate(event);
       this.xCoordinate=transform(coordinate, 'EPSG:3857', 'EPSG:4326')[1];
       this.yCoordinate=transform(coordinate, 'EPSG:3857', 'EPSG:4326')[0];
       this.service.formModel.controls['xCoordinates'].setValue(this.xCoordinate);
       this.service.formModel.controls['yCoordinates'].setValue(this.yCoordinate);
       let ref = document.getElementById('cancel')
       ref.click();
    }
 }


  OnChangeCitiy(citiyId: Number){
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
          this.router.navigate(['/tasinmazhome/listtasinmaz']);

        });        
  }
  OntasinmazEkleCikis(){
    this.router.navigate(['/tasinmazhome/listtasinmaz']);
  }
}
  