import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-payment',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule,],
  templateUrl: './cus-payment.component.html',
  styleUrl: './cus-payment.component.css'
})
export class CusPaymentComponent implements OnInit{
  selectedFile: File | null = null;

  imagePreview: any;
  // modeOfPayment: any;
  // paymentAmount: any;

  cust_id = {id:localStorage.getItem('Cust_ID')};
  trackingNumber: {id: string | null} = {id:localStorage.getItem('Tracking_number')};
  uploadform: any;

  constructor(private http: HttpClient, private route: Router){
    this.uploadform = new FormGroup({
      Mode_of_Payment: new FormControl(null),
      Amount: new FormControl(null),
    })
  }

  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Update image preview with selected file
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveform(){
    console.log(this.uploadform.value)
  }
  upload(){
    console.log(this.trackingNumber.id);
    console.log(this.uploadform.value)
    if (this.selectedFile) {
      const formData = new FormData();

      formData.append('Mode_of_Payment', this.uploadform.get('Mode_of_Payment').value);
      formData.append('Amount', this.uploadform.get('Amount').value);

      formData.append('Pro_filename', this.selectedFile, this.selectedFile.name);
    
      this.http.post(`http:localhost:8000/api/upload/${this.trackingNumber.id}`, formData)
        .subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Success!',
              text: 'Image uploaded successfully',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.route.navigate(["/main/cusmainhome/homemain/cuscurtrans"]);
            });
          },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'Error uploading image',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Error', error);
          }
        );
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please select an image first',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    
  }
  
  ngOnInit(): void {
    
  }
}

function subscribe(arg0: (response: any) => void, arg1: (error: any) => void): any {
  throw new Error('Function not implemented.');
}
