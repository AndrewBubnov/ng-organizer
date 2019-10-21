import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SelectorComponent } from './components/selector/selector.component';
import { MomentPipe } from './pipes/moment.pipe';
import { EllipsisPipe } from './pipes/elipsify.pipe';
import { TasksMapPipe } from './pipes/tasks-map.pipe';
import { CalendarComponent } from './components/calendar/calendar.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorSnackbarComponent } from './components/error-snackbar/error-snackbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pinch': { enable: false },
    'rotate': { enable: false }
  }
}


@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    MomentPipe,
    EllipsisPipe,
    TasksMapPipe,
    CalendarComponent,
    OrganizerComponent,
    ErrorSnackbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
