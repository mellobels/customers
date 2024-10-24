import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewhistory',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './viewhistory.component.html',
  styleUrl: './viewhistory.component.css'
})
export class ViewhistoryComponent implements OnInit{

  constructor(private post: MyServiceService,private router:Router){}

  id = localStorage.getItem("Cust_ID");
  hist:any;
  transDet_ID:any;
  temp:any;

  histf: any[] = []; // Original data source
  filteredHist: any[] = []; // Filtered data for display


  ngOnInit(): void {
    console.log(this.id);
  
    // Fetch data from the API
    this.post.gethis(this.id).subscribe((data: any) => {
      this.hist = data;
      this.histf = data; // Populate the original data source
  
      // Initially display all entries after data is loaded
      this.filteredHist = this.histf;
  
      // Debugging: Ensure data is correctly retrieved
      console.log(this.hist);
      console.log(data);
      console.log(this.id);
    });
  }

  filterStatus(status: string): void {
    if (status === 'All') {
      // Show all items if "All" is selected
      this.filteredHist = this.histf;
    }else if(status === 'for Release'){
      this.filteredHist = this.histf.filter(h=> h.Transac_status === status);
    }else{
      // Filter by selected status
      this.filteredHist = this.histf.filter(h => h.Transac_status === status);
    }
  }

  
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
    this.router.navigate(['/main/maintrans/maintrans/panel/historydetails']);
    });
    
  }

  

}
