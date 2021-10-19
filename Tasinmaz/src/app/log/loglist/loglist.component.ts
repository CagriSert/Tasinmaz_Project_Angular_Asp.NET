import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/shared/log.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-loglist',
  templateUrl: './loglist.component.html',
  styles: []
})
export class LoglistComponent implements OnInit {

    constructor(private router:Router,private service:LogService) { }
    totalLength:any;
    page:number = 1;
    fileName = 'TasinmazKayit.xlsx';

  ngOnInit() {
    this.service.GetLog();
  }

  OnLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
  GetKullanicilarPage(){
    this.router.navigateByUrl('/user/listuser');
  }
  GetTasinmazlarPage(){
    this.router.navigateByUrl('/tasinmazhome/listtasinmaz');
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
}
