import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasinmazService } from 'src/app/shared/tasinmaz.service';
import Map from 'ol/Map';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import View from 'ol/View';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';


import Tile from 'ol/layer/Tile';
import Vector from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import {fromLonLat, transform}from 'ol/proj.js' 
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MultiPolygon from 'ol/geom/MultiPolygon';
import {Circle as CircleStyle} from 'ol/style';

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
  mapParsel:Map;
  xCoordinate:number;
  yCoordinate:number;
  view:View;
  xCoordinateParsel:number;
  yCoordinateParsel:number;
  
  constructor(public service : TasinmazService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.service.GetCities().subscribe(
      data => this.cities=data 
    );
    this.IntilazeMap();
    this.IntilazeMapParsel();
  }
  IntilazeMap(){
    this.view = new View({
        center: [3876682.9740679907, 4746346.604388495],
        zoom: 6.5,
        minZoom:5.8
      });
      console.log("mao")

    this.map = new Map({
     view:this.view,
      layers: [
        new Tile({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        }),zIndex:-12312
        }),
      ],
      target: 'ol-map'
    }); 
    
  }
  IntilazeMapParsel(){
    this.view = new View({
        center: [3876682.9740679907, 4746346.604388495],
        zoom: 6.5,
        // minZoom:5.8
      });
      console.log("mao")
    this.mapParsel = new Map({
     view:this.view,
      layers: [
        new Tile({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        }),zIndex:-5444
        }),
      ],
      target: 'ol-map-parsel'
    }); 
  }
  GetCoord(event: any){
    if(confirm("Koordinatı Almak istediğinize eminmisiniz??")) {
       var coordinate = this.map.getEventCoordinate(event);
       this.xCoordinate=transform(coordinate, 'EPSG:3857', 'EPSG:4326')[1];
       this.yCoordinate=transform(coordinate, 'EPSG:3857', 'EPSG:4326')[0];
       let ref = document.getElementById('cancel')
       ref.click();
    }
 }


 parsel:any;
 vector:any;
  GetCoordParsel(event: any){

    if(confirm("Parseli Seçmek istediğinize eminmisiniz??")) {      
      var coordinate = this.mapParsel.getEventCoordinate(event);
      var s =  transform(coordinate, 'EPSG:3857', 'EPSG:4326');


      console.log(s);
      var feature = new Feature({
        labelPoint: new Point(s),
        name: 'My Polygon'
      });

      feature.setGeometryName('labelPoint');
      var point = feature.getGeometry();
      
      var format = new WKT(),
      wkt = format.writeGeometry(point);
      console.log(wkt.toString());




      

      this.service.GetParsel(wkt.toString()).subscribe(data => this.parsel=data);

     var formats = new WKT()

    //  var featureGeo = formats.readFeature(this.parsel[0]["geomWkt"], {
     
    //  });const styles = [
  /* We are using two different styles for the polygons:
   *  - The first style is for the polygons themselves.
   *  - The second style is to draw the vertices of the polygons.
   *    In a custom `geometry` function the vertices of a polygon are
   *    returned as `MultiPoint` geometry, which will be used to render
   *    the style.
   */
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
try {


  var featureGeo = formats.readFeature(this.parsel[0]["geomWkt"], {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
     });
     this.mapParsel.removeLayer(this.vector);

     var sourr = new VectorSource({
      features: [featureGeo],
    });
      this.vector = new VectorLayer({
       source: sourr,style:stt
     });

    this.mapParsel.addLayer(this.vector);
    this.service.formModel.controls['xCoordinatesParsel'].setValue(s[0]);
    this.service.formModel.controls['yCoordinatesParsel'].setValue(s[1]);
    this.service.formModel.controls['Parsel'].setValue(this.parsel[0]["parselNo"]);
    this.service.formModel.controls['Nitelik'].setValue(this.parsel[0]["cins"]);
    this.service.formModel.controls['Ada'].setValue(this.parsel[0]["adaNo"]);
    console.log(this.parsel[0])
    console.log(this.parsel[0]["parselNo"])
    console.log(this.parsel[0]["adaNo"])

} catch (error) {
  console.error("hataaa")  
  this.toastr.error('Lütfen Tanımlanan yerlerden parsel seçmeyi deneyin!','Hata!');

}
    
    //   var pPath = {
    //     'type': 'Polygon',
    //     'coordinates': this.parsel[0]["geomWkt"]
    // };
    
    // var fPath = {
    //     'type': 'Feature',
    //     'geometry': pPath
    // };
    
    // var svPath = new Vector({
    //     features: new GeoJSON().readFeatures(fPath, {featureProjection: this.map.getView().getProjection()})
    // });
    
    // var lvPath = new Vector({
    //     source: svPath,
    // });
    // var geometry = new MultiPolygon([
    //   this.parsel[0]["geomWkt"]
    // ]);
    // geometry.transform('EPSG:4326', 'EPSG:3857');

    // var vectorLayer = new Vector({
    //   source: new Vector({
    //      features: [new Feature({
    //          geometry: geometry
    //      })]
    //     })
    // });

    //this.mapParsel.getView().fit(sourr.getExtent());
    //console.log(this.parsel[0]["geomWkt"]);
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
  