import {Component, OnInit} from '@angular/core';
import {DateService} from '../../services/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { Task } from '../../models/Task'
import { Week } from '../../models/Week';
import { MatSnackBar } from '@angular/material';

const warning = 'Unfortunately you can not add or delete tasks in offline mode';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup;
  tasks: Task[] = [];
  calendar: Week[];


  constructor(public dateService: DateService,
              private taskService: TasksService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });

    this.taskService.loadTasks().subscribe();

    this.dateService.date$.subscribe(date => {
      if (this.taskService.allTasks){
        this.taskService.getTasksByMonth(date)
      }
    });

    this.dateService.date$
      .subscribe(date => {
        this.dateService.calendar$.subscribe(data => {
          this.calendar = data;
          data.forEach(week => {
            week.days.forEach(day => {
              if (day.value.format('DD-MM-YYYY') === date.format('DD-MM-YYYY')){
                this.tasks = day.tasks
              }
            })
          })
        })
      });

  }

  submit() {
    if (navigator.onLine){
      const {title} = this.form.value;
      const task: Task = {
        title,
        date: this.dateService.date$.value.format('DD-MM-YYYY')
      };
      this.taskService.createTask(task).subscribe(task => {
        this.tasks.push(task);
        const dateArray = task.date.split('-');
        const month: string = dateArray[1];
        const year: string = dateArray[2];
        const tasks = this.taskService.allTasks
        if (!tasks[year]) tasks[year] = {};
        if (!tasks[year][month]) tasks[year][month] = {};
        if (!tasks[year][month][task.date]) tasks[year][month][task.date] = {};
        tasks[year][month][task.date][task.id] = {date: task.date, title: task.title};
      })
    } else {
      this.snackBar.open(warning, "Ok",{duration: 5000, panelClass: ['blue-snackbar']});
    }
    this.form.reset();
  }

  remove(task: Task) {
    if (navigator.onLine){
      this.taskService.removeTask(task).subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id)
        const calendar = this.dateService.calendar$.value;
        let currentDay = null;
        for (let week of calendar){
          currentDay = week.days.find(day => (day.value.format('DD-MM-YYYY') === task.date));
          if (currentDay) break;
        }
        currentDay.tasks = this.tasks;

        const dateArray = task.date.split('-');
        const month: string = dateArray[1];
        const year: string = dateArray[2];
        const taskInAllTasks = this.taskService.allTasks[year][month][task.date];
        if (taskInAllTasks) delete taskInAllTasks[task.id];
      })
    } else {
      this.snackBar.open(warning, "Ok",{duration: 5000, panelClass: ['blue-snackbar']});
    }

  }



}
