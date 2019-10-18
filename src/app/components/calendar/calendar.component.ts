import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../../services/date.service';
import { TasksService } from '../../services/task.service';
import {filter, switchMap} from 'rxjs/operators';
export {Task} from '../../services/task.service'

export interface Day {
  value: moment.Moment
  active: boolean
  disabled: boolean
  selected: boolean
  tasked: boolean
  tasks: Task[]
}

interface Task {
  id?: string
  title: string
  date?: string
  index?: string
}


export interface Week {
  days: Day[]
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  private calendar: Week[];
  private month: number;

  constructor(private dateService: DateService, private taskService: TasksService) {
  }

  ngOnInit() {
    this.dateService.date$.subscribe(() => {
      if (this.dateService.date$.value.month() !== this.month){
        this.generateCalendar(this.dateService.date$.value);
      } else {
        this.reSelectDay(this.dateService.date$.value.format('DD-MM-YYYY'));
      }
    });


    this.dateService.date$
      .pipe(
        filter(data => this.month !== data.month()),
        switchMap(value => this.taskService.loadTasks(value))
      )
      .subscribe(tasks => {
          this.taskService.getIndexed(tasks, this.calendar);
          this.month = this.dateService.date$.value.month();
        },
        error => this.taskService.error$.next(error));


  }

  reSelectDay = (day: string) => {
    this.calendar.forEach(week => {
      week.days.forEach(item => {
        const currentDate = item.value.format('DD-MM-YYYY');
        item.selected = (day === currentDate)
      })
    })
  };

  generateCalendar = (currentDay: moment.Moment) => {
    const firstDay = currentDay.clone().startOf('month').startOf('week');
    const lastDay = currentDay.clone().endOf('month').endOf('week');
    const date = firstDay.clone().subtract(1, 'day');
    const calendar = [];
    while (date.isBefore(lastDay)){
      calendar.push({
        days: Array.from({length: 7},
          () => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !currentDay.isSame(value, 'month');
            const selected = currentDay.isSame(value, 'day');
            const tasks = [];
            return {value, active, disabled, selected, tasks}
          })
      })
    }
    this.calendar = calendar;
  };

  onSelect = (day) => {
    if (!day.disabled){
      this.dateService.selectDate(day.value);
    }
  };


}
