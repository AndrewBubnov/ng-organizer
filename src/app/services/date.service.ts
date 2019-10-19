import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';
import {Week} from '../models/Week';

@Injectable({
  providedIn: 'root'
})
export class DateService {
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


}
