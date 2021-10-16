import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-tasinmazhome',
  templateUrl: './tasinmazhome.component.html',
  styles: []
})
export class TasinmazhomeComponent implements OnInit {

userDetails;
  constructor( private service:UserService) { }

  ngOnInit() {
    this.service.GetUserProfile().subscribe(
        res=>{
          this.userDetails = res;
          console.log("umumumummu");
          console.log(this.userDetails);
        },
        err=>{
          console.log(err);
        },
    );
  }

  
}
