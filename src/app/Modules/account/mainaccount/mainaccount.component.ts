import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';

@Component({
  selector: 'app-mainaccount',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './mainaccount.component.html',
  styleUrl: './mainaccount.component.css'
})
export class MainaccountComponent implements OnInit {
  customerData: any;
  customer: any;
  profileform = new FormGroup({
    cid: new FormControl(null),
    fname: new FormControl(null),
    lname: new FormControl(null),
    mname: new FormControl(null),
    email: new FormControl(null),
    phonenum: new FormControl(null),
    address: new FormControl(null),
    cust_image: new FormControl(null), // Add image field
  });

  selectedImage: File | null = null; // Store selected file
  imagePreview: string | ArrayBuffer | null = null; // For image preview

  constructor(private myserv: MyServiceService) {}

  custid:any;

  // fetch() {
  //   this.custid = localStorage.getItem("Cust_ID");
  //   this.myserv.getcustomerdata(this.custid).subscribe((data: any) => {
  //     this.customerData = data;
  //     if (data && data.length > 0) {
  //       const customer = data[0]; // Assume there is only one customer
  //       this.profileform.setValue({
  //         cid: customer.cust_id,
  //         fname: customer.cust_fname,
  //         lname: customer.cust_lname,
  //         mname: customer.cust_mname,
  //         phonenum: customer.cust_phoneno,
  //         address: customer.cust_address,
  //         email: customer.cust_email,
  //         cust_image: customer.cust_image // Populate image field
  //       });

  //       this.imagePreview = customer.cust_image ? `http://localhost/storage/app/public/images/${customer.cust_image}` : null;
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.custid = localStorage.getItem("Cust_ID"); // Ensure custid is retrieved from localStorage
    if (!this.custid) {
      console.error("Customer ID is not set or is null");
      return; // Exit if custid is not set
    }
  
    this.myserv.getcustomer(this.custid).subscribe((data: any) => {
      this.customerData = data.customerData;
      this.customer = data.customerFirst;
      console.log(this.customerData);
      console.log(this.customer);
      console.log('Fetched customer data:', data);
      console.log('Using custid:', this.custid);
    
      // Access the customer data using the correct key
      const customerKey = Object.keys(data.customerData)[0]; // Get the first key, which should be '2'
      const customer = data.customerData[customerKey]; // Access the customer object
  
      if (customer) {
        console.log('Customer:', customer);
        
        // Set values in the form
        this.profileform.setValue({
          cid: customer.Cust_ID,
          fname: customer.Cust_fname,
          lname: customer.Cust_lname,
          mname: customer.Cust_mname,
          phonenum: customer.Cust_phoneno,
          address: customer.Cust_address,
          email: customer.Cust_email,
          cust_image: customer.Cust_image // Populate image field
        });
  
        this.imagePreview = customer.Cust_image ? `http://localhost:8000/storage/${customer.Cust_image}` : null;
        console.log('Current form values:', this.profileform.value);
      } else {
        console.warn('No customer data available for ID:', this.custid);
      }
    }, (error) => {
      console.error('Error fetching customer data:', error);
    });
  }
  

  // Method to handle file input change
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedImage = file;

    // Show image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  updateCus() {
    const formData = new FormData();
    
    // Use a non-null assertion operator (!) to inform TypeScript that these values will not be null or undefined
    const cid = this.profileform.get('cid')?.value;
    const fname = this.profileform.get('fname')?.value;
    const lname = this.profileform.get('lname')?.value;
    const mname = this.profileform.get('mname')?.value;
    const phonenum = this.profileform.get('phonenum')?.value;
    const address = this.profileform.get('address')?.value;
    const email = this.profileform.get('email')?.value;

    // Ensure all fields are not null or undefined before appending
    if (cid) formData.append('cid', cid);
    if (fname) formData.append('fname', fname);
    if (lname) formData.append('lname', lname);
    if (mname) formData.append('mname', mname);
    if (phonenum) formData.append('phonenum', phonenum);
    if (address) formData.append('address', address);
    if (email) formData.append('email', email);

    // Append image if it exists
    if (this.selectedImage) {
        formData.append('cust_image', this.selectedImage, this.selectedImage.name);
    } else {
        console.log("No image selected");
    }

    this.myserv.updateCus(formData).subscribe(
        (result: any) => {
            // this.fetch();
            console.log(result);
        },
        (error) => {
            console.error("Error uploading data", error);
        }
    );
}

}
