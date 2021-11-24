import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe } from '@angular/core/src/render3';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AddtasinmazComponent } from '../tasinmazhome/addtasinmaz/addtasinmaz.component';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {

  constructor(private fb:FormBuilder,private http:HttpClient,private toastr: ToastrService) { }
  readonly BaseURI='https://localhost:5001/api';
  tasinmaz:[];
  deger:string;
  boslukKontrolHataMessage='Bu alan zorunludur.';


  formModel = this.fb.group({
    Cities: ['',Validators.required],
    Districts: [{value:'',disabled:false}],
    Neighbourhoods:[{value:'',disabled:false}],
    Ada:[null,Validators.required],
    Parsel:[null,Validators.required],
    Nitelik:[null,Validators.required],
    xCoordinatesParsel:[null,Validators.required],
    yCoordinatesParsel:[null,Validators.required]
  });

  BtnTasinmazEkle(){
    if(this.formModel.value.Ada!=null){
        var body={
        ilId:this.formModel.value.Cities,
        ilceId:this.formModel.value.Districts,
        mahalleId:this.formModel.value.Neighbourhoods,
        ada:this.formModel.value.Ada,
        parsel:this.formModel.value.Parsel,
        nitelik:this.formModel.value.Nitelik,
        xCoordinate:this.formModel.value.xCoordinatesParsel.toString(),
        yCoordinate:this.formModel.value.yCoordinatesParsel.toString()
      };
      console.log(body);
      return this.http.post(this.BaseURI+'/Tasinmaz/Add',body);
    }else{
      this.toastr.error("Lütfen parsel yanındaki butona basıp bir koordinak seçin","Hata")
    }
    
    }

  GetCities(){
    return this.http.get(this.BaseURI+'/Tasinmaz/Cities').pipe( );
  }
  citiName:[];
  GetSingleCities(){
    this.tasinmaz.forEach(function(value){
      // this.service.getSingleCities( value.ilId).subscribe((result:any)=>{
      //     return this.http.get(this.BaseURI+'/Tasinmaz/Cities/Single/'+result.ilName).subscribe((result:any)=>
      //     {
      //         this.citiName=result;
      //     });
      //   });
    });
  }

  GetDistricts(citiyId:Number){
    return this.http.get(this.BaseURI+'/Tasinmaz/Districts/'+citiyId).pipe( );
  }
  GetSingleDistricts(distrtictId:Number){

  }

  GetNeighbourhood(districtsId:Number){
    return this.http.get(this.BaseURI+'/Tasinmaz/Neighbourhood/'+districtsId).pipe( );
  }
  GetSingleNeighbourhood(neighbourdId:Number){

  }

  tasinmazIlId:[];
  totalLength:any;
  page:number = 1;
  GetTasinmaz(){
    return this.http.get(this.BaseURI+'/Tasinmaz').subscribe((result:any)=>{
      this.tasinmaz = result;
      this.totalLength = result.length;
      console.log("uieuie");
      console.log(result);

      (result as []).forEach((tasinmaz:any)=>{
        this.tasinmazIlId = tasinmaz.ilId;
    });
      //console.log(this.showpost.ilName);
    });
    
  }
  DeleteTasinmaz(id:Number){
    return this.http.delete(this.BaseURI+'/Tasinmaz/Delete/' + id );
  }
  UpdateTasinimazDatabase(data:any,id:Number){
     
    return this.http.put(this.BaseURI+'/Tasinmaz/Update/'+id,data)
    .pipe(map((res:any)=>{
      return res;  
    }));
  
  // GetUserProfile(){
  //   var tokenHeader = new HttpHeaders({'Authorization':'Bearer '+localStorage.getItem('token')})
  //   return this.http.get(this.BaseURI+'/UserProfile',{headers:tokenHeader});
  // }


  }

  GetParsel(wkt){
    return this.http.get(this.BaseURI + '/Tasinmaz/Parsel/'+ wkt).pipe();
  }
}
