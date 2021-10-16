import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {

  constructor(private fb:FormBuilder,private http:HttpClient) { }
  readonly BaseURI='https://localhost:5001/api';
  tasinmaz:[];
  deger:any;

  formModel = this.fb.group({
    Cities: ['',Validators.required],
    Districts: [{value:'',disabled:false}],
    Neighbourhoods:[{value:'',disabled:false}],
    Ada:['',Validators.required],
    Parsel:['',Validators.required],
    Nitelik:['',Validators.required]
  });

  BtnTasinmazEkle(){
    var body={
      ilId:this.formModel.value.Cities,
      ilceId:this.formModel.value.Districts,
      mahalleId:this.formModel.value.Neighbourhoods,
      ada:this.formModel.value.Ada,
      parsel:this.formModel.value.Parsel,
      nitelik:this.formModel.value.Nitelik
    };
    return this.http.post(this.BaseURI+'/Tasinmaz/Add',body);
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

      (result as []).forEach((tasinmaz:any)=>{
        this.tasinmazIlId = tasinmaz.ilId;
    });
      //console.log(this.showpost.ilName);
    });
    
  }
  DeleteTasinmaz(id:Number){
    return this.http.delete(this.BaseURI+'/Tasinmaz/Delete/' + id );
  }
  
  // GetUserProfile(){
  //   var tokenHeader = new HttpHeaders({'Authorization':'Bearer '+localStorage.getItem('token')})
  //   return this.http.get(this.BaseURI+'/UserProfile',{headers:tokenHeader});
  // }


}
