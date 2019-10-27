import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map }from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DateService } from './date.service';
import { Task } from '../models/Task'
import { DayTasks } from '../models/DayTasks'
import { CreateResponse } from '../models/CreateResponse'
import { Day } from '../models/Day'
import { Week } from '../models/Week'



@Injectable({providedIn: 'root'})
export class TasksService {
  static url = 'https://ng-calendar-c73fc.firebaseio.com/tasks';
  public allTasks: any;
  constructor(private http: HttpClient, private dateService: DateService) {}

  loadTasks() {
    return this.http
      .get<Task[]>(`${TasksService.url}/.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          this.allTasks = tasks;
          this.getTasksByMonth(moment())
        })
      );
  }

  getTasksByMonth = (date) => {
    const month = date.month() + 1;
    const year = date.year();

    if (month in this.allTasks[year]){

      const clone = JSON.parse(JSON.stringify(this.allTasks[year][month]));
      const inputArray = Object.keys(clone).map(key => ({[key]: clone[key]}));
      const outputArray = inputArray.map(dayTask => {
        const day = Object.keys(dayTask)[0];
        const tasks = dayTask[day];
        const dailyTasks = Object.keys(tasks).map(id => {
          let task = {...tasks[id]};
          return {id, ...task};
        });
        return {date: day, tasks: dailyTasks};
      });
      this.assignTasksToCalendar( outputArray, this.dateService.calendar$.value);

    }
  };


  createTask = (task: Task) => {
    const year = task.date.split('-')[2]
    const month = task.date.split('-')[1]
        return this.http
          .post<CreateResponse>(`${TasksService.url}/${year}/${month}/${task.date}.json`, task)
          .pipe(map(res => {
            return {...task, id: res.name}
          }))
  }


  assignTasksToCalendar = (tasks: DayTasks[], calendar: Week[]) => {

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
