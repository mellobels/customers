import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';

@Component({
  selector: 'app-viewhistory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './viewhistory.component.html',
  styleUrl: './viewhistory.component.css'
})
export class ViewhistoryComponent implements OnInit{

  constructor(private post: MyServiceService){}

  id = localStorage.getItem("Cust_ID");
  hist:any;
  ngOnInit(): void {
    this.post.gethis(this.id).subscribe((data:any)=>{
      this.hist = data;
      console.log(this.hist);
      console.log(data);
      console.log(this.id);
    })
   
  }

}
