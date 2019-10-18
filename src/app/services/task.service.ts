import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import * as moment from 'moment';
import {Day, Week} from '../components/calendar/calendar.component';
import {DateService} from './date.service';

export interface Task {
  id?: string
  title: string
  date?: string
  index?: string
}

export interface DayTasks {
  date: string
  tasks: Task[]
}



interface CreateResponse {
  name: string
}


@Injectable({providedIn: 'root'})
export class TasksService {
  static url = 'https://ng-calendar-c73fc.firebaseio.com/tasks';

  public tasked$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public error$: BehaviorSubject<string> = new BehaviorSubject<string>('');


  constructor(private http: HttpClient, private dateService: DateService) {}

  loadTasks(date: moment.Moment) {
    const year = date.year();
    const month = date.month() + 1;
    return this.http
      .get<Task[]>(`${TasksService.url}/${year}/${month}/.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          const clone = JSON.parse(JSON.stringify(tasks));
          const inputArray = Object.keys(clone).map(key => ({[key]: clone[key]}));
          return inputArray.map(dayTask => {
            const day = Object.keys(dayTask)[0];
            const tasks = dayTask[day];
            const dailyTasks = Object.keys(tasks).map(id => {
              let task = {...tasks[id]};
              return {id, ...task};
            });
            return {date: day, tasks: dailyTasks};
          });
        })
      );
  }

  createTask(task: Task) {
    const year = task.date.split('-')[2]
    const month = task.date.split('-')[1]
        return this.http
          .post<CreateResponse>(`${TasksService.url}/${year}/${month}/${task.date}.json`, task)
          .pipe(map(res => {
            return {...task, id: res.name}
          }))
  }


  getIndexed = (tasks: DayTasks[], calendar: Week[]) => {
    tasks.forEach(task => {
      calendar.forEach(week => {
        const taskedDay: Day = week.days.find(item => item.value.format('DD-MM-YYYY') === task.date);
        if (taskedDay) {
          taskedDay.tasks = task.tasks
        }
      })
    })
   this.dateService.calendar$.next(calendar);
  };


  removeTask(task: Task): Observable<void> {
    const year = task.date.split('-')[2];
    const month = task.date.split('-')[1];
          return this.http
            .delete<void>(`${TasksService.url}/${year}/${month}/${task.date}/${task.id}.json`)
  }



}
