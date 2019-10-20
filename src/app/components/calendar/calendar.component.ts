import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date.service';
import { TasksService } from '../../services/task.service';
import { filter, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  private month: number;
  public desktop: boolean = window.innerWidth > 380;

  constructor(private dateService: DateService, private taskService: TasksService) {
  }

  ngOnInit() {

    this.dateService.date$.subscribe(() => {
      if (this.dateService.date$.value.month() !== this.month){
        this.dateService.generateCalendar();
      } else {
        this.dateService.reSelectDay();
      }
    });

    this.dateService.date$
      .pipe(
        filter(data => this.month !== data.month()),
        switchMap(value => this.taskService.loadTasks(value))
      )
      .subscribe(tasks => {
          this.taskService.getIndexed(tasks, this.dateService.calendar$.value);
          this.month = this.dateService.date$.value.month();
        },
        error => this.taskService.error$.next(error));

  }

  onSelect = (day) => {
    if (!day.disabled){
      this.dateService.selectDate(day.value);
    }
  }

}
