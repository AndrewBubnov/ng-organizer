import {Component, OnInit} from '@angular/core';
import {DateService} from '../../services/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { Task } from '../../models/Task'
import { Week } from '../../models/Week';


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
              private taskService: TasksService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
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
      })
  }

  submit() {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date$.value.format('DD-MM-YYYY')
    }

    this.taskService.createTask(task).subscribe(task => {
      this.tasks.push(task)
      this.form.reset()
    })
  }

  remove(task: Task) {
    this.taskService.removeTask(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id)
      const calendar = this.dateService.calendar$.value;
      let currentDay = null;
      for (let week of calendar){
        currentDay = week.days.find(day => (day.value.format('DD-MM-YYYY') === task.date));
        if (currentDay) break;
      }
      currentDay.tasks = this.tasks;
    })
  }



}
