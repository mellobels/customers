import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../my-service.service';

@Component({
  selector: 'app-cus-signup',
  standalone: true,
  imports: [],
  templateUrl: './cus-signup.component.html',
  styleUrl: './cus-signup.component.css'
})
export class CusSignupComponent implements OnInit{
  constructor(private myserve:MyServiceService){}
  ngOnInit(): void {

  }

  

}
