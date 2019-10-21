import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/Task'

const emptyTask: Task = {
  title: '...'
};

@Pipe({
  name: 'tasksMap',
  pure: false,
})
export class TasksMapPipe implements PipeTransform {
  transform(tasks: Task[]): Task[] {
    return tasks.length > 2 ? [tasks[0], emptyTask] : tasks;
  }
}
