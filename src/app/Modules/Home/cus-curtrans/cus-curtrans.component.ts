import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { SearchPipe } from '../../../search.pipe';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-curtrans',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchPipe, FormsModule],
  templateUrl: './cus-curtrans.component.html',
  styleUrls: ['./cus-curtrans.component.css']
})
export class CusCurtransComponent implements OnInit {
  post = inject(MyServiceService);
  selectedService: string | undefined;  // Ensure this is just a single string
  user: any;

  constructor(private elementRef: ElementRef, private router: Router) { }

  list: any;
  trackingNumber: any;
  customerData: any;
  customerId = localStorage.getItem('Cust_ID');
  latestTransactions: any;
  spec: any;
  filteredLatest = [];
  searchTerm = '';
  categories: any[] = []; // Initialize categories array
  @ViewChild('updateModal') updateModal!: ElementRef;

  laundryList = this.post.post; // Initialized from the service
  serviceOptions = this.post.trans; // Initialized from the service
  selectedTransaction: any = {}; // This will hold the selected transaction details
  availableServices = ['Hand Wash', 'Press', 'Rush Jobs', 'Pick-up', 'Delivery']; // Available services
  deletedDetails: number[] = [];  // Array to track deleted transaction details
  transDet_ID: any;
  temp:any;

  fetch() {
    console.log(this.customerId);
    this.loadCategories();
    this.loadCustomerData();
    this.loadLatestTransactions();
  }
  
  ngOnInit(): void {
    console.log(this.customerId);
    this.fetch()
  }


  gentrack() {
    const randomNumber = Math.floor(Math.random() * 1000000000000) + 100000000000;
    this.trackingNumber = `S2K-${randomNumber}`;
  }

  addToList() {
    const selectElement = document.getElementById('browser') as HTMLSelectElement;
    const laundryType = selectElement.value; // Get the categ_id (integer)
    const count = (document.getElementById('weight') as HTMLInputElement).value; // Get the qty

    if (laundryType && count != null) {
      const newItem = {
        Categ_ID: laundryType, // Store the categ_id (integer)
        Category: selectElement.options[selectElement.selectedIndex].text, // Store the category name (text)
        Qty: count, // Store the quantity
        Transac_status:"Pending"
      };

      this.laundryList.push(newItem); // Add the new item to the list
      this.post.post = this.laundryList; // Update the post service
      console.log(this.laundryList); // For debugging, check the output in the console
      console.log("LAUNDRY",this.laundryList);
      console.log(newItem);
    }
  }


  loadCategories() {
    this.post.getlist().subscribe((data: any) => {
      this.categories = data;
      this.spec = data;
      console.log(this.categories);
    });
  }

  loadCustomerData() {
    this.post.getcustomer(this.customerId).subscribe((data: any) => {
      this.customerData = Object.values(data.customerData);
      console.log(this.customerData);
    });
  }

  // Load latest transactions
  loadLatestTransactions() {
    this.post.display(this.customerId).subscribe((data: any) => {
      this.latestTransactions = data.transaction;
      console.log(data.transaction)
      // this.latestTransactions = data;
      // console.log(this.latestTransactions);
      console.log(data);

      if(this.latestTransactions && this.latestTransactions.length > 0){
        const pendingTransactions = this.latestTransactions.filter((transs: any) => 
        transs.trans_stat === 'paid');
        
  
        if(pendingTransactions.length > 0){
          console.log('Pending Trans', pendingTransactions);
          this.latestTransactions = pendingTransactions;
        } else {
          console.log( "no pending")
          this.latestTransactions = [];
        }
      }
    });


  }

  // Insert a new order
  insertOrder() {
    const stat = "Pending"
    const transacStatus = this.selectedService; 
    if (transacStatus != null) {
      this.post.trans = transacStatus; // Set trans directly as a string
        }
    this.post.insertorder(this.customerId, this.trackingNumber,stat).subscribe((data: any) => {
      console.log(data);
      console.log("LAUNDRY",this.laundryList);
      this.laundryList = []; // Reset laundry list after order insertion
      console.log(this.post.trans);
      this.fetch();
    });
  }

  // Show transaction details
  showTransactionDetails(transactionId: any) {
    // this.post.showdetail(transactionId).subscribe((data: any) => {
    //   console.log(data);
      this.router.navigate(['/main/cusmainhome/homemain/cuscurtrans/payment', transactionId]);
    // });
  }

  // Cancel an order
  cancelOrder(orderId: any) {
    this.post.cancel(orderId).subscribe((result: any) => {
      console.log(result);
      this.loadLatestTransactions();
    });
  }

  updateTransaction() {
    if (this.selectedTransaction && this.selectedTransaction.details) {
      const updates: any[] = [];
      const newEntries: any[] = [];

      const transacStatus = this.selectedTransaction.Transac_status || 'Pending';

      // Prepare data for updates, new additions, and deletions
      this.selectedTransaction.details.forEach((detail: any) => {
        if (detail.TransacDet_ID) {
          updates.push({
            TransacDet_ID: detail.TransacDet_ID,
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Transac_status: transacStatus
          });
        } else {
          newEntries.push({
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Tracking_number: this.selectedTransaction.Tracking_number
          });
        }
      });

      console.log('Updates:', updates);
      console.log('New Entries:', newEntries);
      console.log('Deleted Entries:', this.deletedDetails);

      // Send updates to the server
      if (updates.length > 0) {
        this.post.updatetrans({ updates }).subscribe((result: any) => {
          console.log('Update result:', result);
          this.loadLatestTransactions();
          this.closeModal();
        });
      }

      // Send new entries to the server
      if (newEntries.length > 0) {
        this.post.insertNewDetails(newEntries).subscribe((result: any) => {
          console.log('Insert result:', result);
          this.loadLatestTransactions();
          this.closeModal();
        });
      }

      // Send deleted entries to the server
      if (this.deletedDetails.length > 0) {
        this.post.deleteDetails(this.deletedDetails).subscribe((result: any) => {
          console.log('Deleted result:', result);
          this.loadLatestTransactions();
          this.closeModal();
        });
      }

      // Update the transaction status in the transactions table
      if (this.selectedTransaction.Tracking_number) {
        this.post.updateTransactionStatus(this.selectedTransaction.Tracking_number, transacStatus).subscribe((result: any) => {
          console.log('Transaction status updated:', result);
        });
      }
    }
  }

  // viewItem(data: any) {
  //   // Implement logic to view details of the item based on tracking number
  //   this.post.getTransId(data).subscribe((result:any)=>{
  //   this.transDet_ID = data;
  //   console.log(data);
  //   console.log(result);
  //   console.log("ITO ANG TRACKING NUMBER: ", this.transDet_ID);
  //   localStorage.setItem('test', this.transDet_ID);
  //   this.router.navigate(['/main/maintrans/maintrans/panel/history']);
  //   });
    
  // }

  viewItem(data: any) {
    // Implement logic to view details of the item based on tracking number
    this.post.getTransId(data).subscribe((result:any)=>{
    this.transDet_ID = data;
    this.temp = data;
    console.log(this.temp);
    console.log(result);
    // console.log("ITO ANG PRIMARY KEY: ", this.transDet_ID);
    console.log("ITO ANG PRIMARY KEY: ", this.temp);
    localStorage.setItem('temp_ID', this.temp);
    const cust_id = localStorage.getItem('Cust_ID');
    console.log(cust_id)
    this.router.navigate(['/main/maintrans/maintrans/panel/history']);
    });
    
  }

  cancelItem(id: any){
    console.log(id);
    // if (this.newtransac.valid) {
      // const updatedData = { id: this.trans_id.id, ...this.newtransac.value };
      this.post.updatetrans(id).subscribe(
        (response: any) => {
          // location.reload();
          console.log('Update successful', response);
          Swal.fire('Success!', 'Laundry Category Price details updated successfully.', 'success').then(() => {
            location.reload(); // Reload the page after the alert is closed
          });
          this.router.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
        },
        (error:any) => {
          console.error('Update failed', error);
          Swal.fire('Error!', 'There was an error updating the category.', 'error');
        }
      );
    // } else {
    //   Swal.fire('Warning!', 'Please fill in all required fields.', 'warning');
    // }
    
  }

  showDetails(Tracking_number: any, transaction: any) {
    // First, set selectedTransaction based on the passed transaction
    this.selectedTransaction = { ...transaction }; // Create a copy of the transaction
    console.log('Selected transaction:', this.selectedTransaction);

    // Then, fetch the details and add them to the selected transaction
    this.post.displayDet(Tracking_number).subscribe((res: any) => {
      this.selectedTransaction.details = res; // Assign details separately
      console.log('Transaction details:', this.selectedTransaction.details);

      // Now open the modal
      const modalElement = document.getElementById('updateModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    });
  }


  // Method to close the modal
  closeModal() {
    const modalElement = document.getElementById('updateModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
      }
    } else {
      console.error('Modal element not found!');
    }
  }

// Method to remove a detail

  removeDetail(index: number) {
    const detail = this.selectedTransaction.details[index];
    if (detail.TransacDet_ID) {
      // Track the detail for deletion if it exists in the database
      this.deletedDetails.push(detail.TransacDet_ID);
    }
    // Remove it from the details array
    this.selectedTransaction.details.splice(index, 1);
  }

// Method to add a new detail row
  addDetail() {
    if (!this.selectedTransaction.details) {
      this.selectedTransaction.details = [];
    }
    this.selectedTransaction.details.push({
      Categ_ID: null, // Default or null category
      Qty: 1, // Default quantity
    });
  }

// Optionally, add method to clear deletedDetails after saving
  resetDeletedDetails() {
    this.deletedDetails = [];
  }


  removeFromList(item: any) {
    const index = this.laundryList.indexOf(item);
    if (index !== -1) {
      this.laundryList.splice(index, 1);
      console.log(this.laundryList);
    }
  }

  
}









