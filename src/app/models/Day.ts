import * as moment from 'moment';
import { Task } from './Task'

export interface Day {
  value: moment.Moment
  active: boolean
  disabled: boolean
  selected: boolean
  tasks: Task[]
}
