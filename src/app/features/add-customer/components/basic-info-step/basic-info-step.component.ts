import {Component, input} from '@angular/core';
import {CustomerBasicInfoFormInterface} from '../../../../store/customers/customer.model';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatStepperNext} from '@angular/material/stepper';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-basic-info-step',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatStepperNext,
    MatButton
  ],
  templateUrl: './basic-info-step.component.html',
  styleUrl: './basic-info-step.component.scss'
})
export class BasicInfoStepComponent {
  formGroup = input.required<FormGroup<CustomerBasicInfoFormInterface>>()
}
