import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date.service';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  private month: number;
  public desktop: boolean = window.innerWidth > 380;

  constructor(public dateService: DateService) {
  }

  ngOnInit() {
    this.dateService.date$.subscribe(() => {
      if (this.dateService.date$.value.month() !== this.month){
        this.dateService.generateCalendar();
      } else {
        this.dateService.reSelectDay();
      }
    });
  }

  onSelect = (day) => {
    if (!day.disabled){
      this.dateService.selectDate(day.value);
    }
  }

  onSwipeLeft = e => {
    if (e.distance > window.innerWidth *.25) this.dateService.changeMonth(1)
  }

  onSwipeRight = e => {
    if (e.distance > window.innerWidth *.25) this.dateService.changeMonth(-1)
  }

}
