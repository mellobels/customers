import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../my-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cus-signup',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cus-signup.component.html',
  styleUrl: './cus-signup.component.css'
})
export class CusSignupComponent implements OnInit{
 
  ngOnInit(): void {

  }

  signupForm = new FormGroup({ 
    Cust_fname: new FormControl(null),
    Cust_lname: new FormControl(null),
    Cust_mname: new FormControl(null),
    Cust_phoneno: new FormControl(null),
    Cust_email: new FormControl(null),
    Cust_address: new FormControl(null),
    Cust_password: new FormControl(null),
    Cust_retypePass: new FormControl(null),
  })

  constructor(private post:MyServiceService){}

  signup(){
    //constant for modal
    const mdiv = document.getElementById('warningmodal');
    const mdiv1 = document.getElementById('warningmodalemail');
    //check if entered password is equal
    if(this.signupForm.controls['Cust_fname'].value == null||this.signupForm.controls['Cust_email'].value == null || this.signupForm.controls['Cust_fname'].value == null|| this.signupForm.controls['Cust_lname'].value == null|| this.signupForm.controls['Cust_mname'].value == null||this.signupForm.controls['Cust_phoneno'].value == null||this.signupForm.controls['Cust_address'].value == null){
     mdiv1!.style.display = 'block';
    }
    else if(this.signupForm.controls['Cust_password'].value == this.signupForm.controls['Cust_retypePass'].value){
      this.post.signup(this.signupForm.value)
      .subscribe((result:any)=>{
        console.log(result)
        // if(result=='Success'){
        //   route to login
        //   this.route.navigate(['/login'])
        // }
      })
    }else{
      if(mdiv!=null){
        //display modal
        mdiv.style.display = 'block';
      }
    }
  }


  //method to close the modal
  closeModal(){
    const mdiv = document.getElementById('warningmodal');
    if(mdiv!=null){
      mdiv.style.display = 'none';
    }
  }

  closeModalemail(){
    const mdiv = document.getElementById('warningmodalemail');
    if(mdiv!=null){
      mdiv.style.display = 'none';
    }
  }

  

}
