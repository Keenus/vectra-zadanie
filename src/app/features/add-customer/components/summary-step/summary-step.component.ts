import {Component, input, output} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormControl, FormGroup} from '@angular/forms';
import {CustomerBasicInfoFormInterface} from '../../../../store/customers/customer.model';

@Component({
  selector: 'app-summary-step',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle
  ],
  templateUrl: './summary-step.component.html',
  styleUrl: './summary-step.component.scss'
})
export class SummaryStepComponent {
  readonly basicInfo = input.required<FormGroup<CustomerBasicInfoFormInterface>>();
  readonly interests = input.required<FormControl<string[]>>();
}
