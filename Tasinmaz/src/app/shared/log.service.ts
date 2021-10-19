import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  
  readonly BaseURI='https://localhost:5001/api';
  
  constructor(private http:HttpClient) { }

  totalLength:any;
  page:number = 1;
  logs:[]
  GetLog(){
    return this.http.get(this.BaseURI+'/Logger').subscribe((result:any)=>{
      this.logs = result;
      this.totalLength = result.length;
    });    
  }
  
}


  