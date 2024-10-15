import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class HistoryComponent implements OnInit {
  transdet: any;
  laundrydet: any;
  id = localStorage.getItem('cust_id');
  tid: any;

  // Define the status map at the class level
  statusMap: { [key: string]: number } = {
    'Ordered': 1,
    'Shipped': 2,
    'On the way': 3,
    'Delivered': 4
  };

  constructor(private post: MyServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Capture 'tid' from the URL parameters
    this.route.paramMap.subscribe(params => {
      this.tid = params.get('tid');
      console.log('Transaction ID:', this.tid);

      // Proceed only if 'tid' is present
      if (this.tid) {
        // Fetch transaction details
        this.post.showdetail(this.tid).subscribe((result: any) => {
          this.transdet = result;
          console.log(this.transdet);
        });

        // Fetch laundry details
        this.post.test(this.tid).subscribe((result: any) => {
          this.laundrydet = result;
          console.log(result);
        });
      } else {
        console.error('Transaction ID is missing');
      }
    });
  }

  // Method to get the class based on the step
  getProgressClass(step: string): string {
    switch (step) {
      case 'Ordered':
        return 'step0';
      case 'Shipped':
        return 'step1';
      case 'On the way':
        return 'step2';
      case 'Delivered':
        return 'step3';
      default:
        return 'step0';
    }
  }

  // Method to check if a step is active based on the status
  isStepActive(stepNumber: number, status: string): boolean {
    // Use the class-level statusMap to check the step
    return this.statusMap[status as keyof typeof this.statusMap] >= stepNumber;
  }
}
