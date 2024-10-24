import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit{

  currentDate:any;
  getDet:any;
  Transac_ID:any;
  track:any;
  constructor(private myserv:MyServiceService){}
  
  ngOnInit(): void {
      this.Transac_ID = localStorage.getItem('temp_ID');
      console.log(this.Transac_ID);
      this.currentDate = this.formatDate(new Date());
      this.myserv.getDetails(this.Transac_ID).subscribe((result:any)=>{
        this.getDet = result;
        this.track = result.Tracking_number;
        // console.log(this.trackingnumber);
        console.log(this.getDet);
        console.log(result)
      })
    }

    
  formatDate(date:Date): string{
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    }
    return date.toLocaleDateString('en-US',options);
  }
}
