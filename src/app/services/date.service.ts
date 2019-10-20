import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';
import {Week} from '../models/Week';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private calendar: Week[];
  public date$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  public calendar$: BehaviorSubject<Week[]> = new BehaviorSubject<Week[]>([]);

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


  reSelectDay = () => {
    const day: string =this.date$.value.format('DD-MM-YYYY');
    this.calendar.forEach(week => {
      week.days.forEach(item => {
        const currentDate = item.value.format('DD-MM-YYYY');
        item.selected = (day === currentDate)
      })
    })
  };

  generateCalendar = () => {
    const currentDay: moment.Moment = this.date$.value;
    const firstDay = currentDay.clone().startOf('month').startOf('isoWeek');
    const lastDay = currentDay.clone().endOf('month');
    const date = firstDay.clone().subtract(1, 'day');
    const calendar = [];
    while (date.isBefore(lastDay, 'day')){
      calendar.push({
        days: Array.from({length: 7},
          () => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !currentDay.isSame(value, 'month');
            const selected = currentDay.isSame(value, 'day');
            const dayOff = date.day() === 6 || date.day() === 0;
            const tasks = [];
            return {value, active, disabled, selected, dayOff, tasks}
          })
      })
    }
    this.calendar = calendar;
    this.calendar$.next(calendar);
  };


}
