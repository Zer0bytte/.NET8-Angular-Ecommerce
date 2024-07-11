import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './components/stepper/stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StepperComponent,
    TextInputComponent
  ],
  imports: [
    CommonModule,
    CdkStepperModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    CdkStepperModule,
    StepperComponent,
    ReactiveFormsModule,
    TextInputComponent
  ]
})
export class SharedModule { }
