import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';
import {Week} from '../components/calendar/calendar.component';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public date$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  public calendar$: BehaviorSubject<Week[]> = new BehaviorSubject<Week[]>([]);

  constructor() { }

  changeMonth = (direction: number) => {
    const month = this.date$.value.add(direction, 'month');
    this.date$.next(month);
  }

  selectDate = (value: moment.Moment) => {
      const selected = this.date$.value.set({
        date: value.date(),
        month: value.month()
      });
      this.date$.next(selected);
  }

  // generateCalendar = (currentDay: moment.Moment) => {
  //   const firstDay = currentDay.clone().startOf('month').startOf('week');
  //   const lastDay = currentDay.clone().endOf('month').endOf('week');
  //   const date = firstDay.clone().subtract(1, 'day');
  //   const calendar = [];
  //   while (date.isBefore(lastDay)){
  //     calendar.push({
  //       days: Array.from({length: 7},
  //         () => {
  //           const value = date.add(1, 'day').clone();
  //           const active = moment().isSame(value, 'date');
  //           const disabled = !currentDay.isSame(value, 'month');
  //           const selected = currentDay.isSame(value, 'day');
  //           const tasks = [];
  //           return {value, active, disabled, selected, tasks}
  //         })
  //     })
  //   }
  //   this.calendar$.next(calendar);
  // };

}
