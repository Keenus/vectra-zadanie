import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Store} from '@ngrx/store';
import {createCustomer} from '../../store/customers.actions';

@Component({
  selector: 'app-add-customer',
  imports: [
    RouterLink,
    MatButton,
    MatStepper,
    MatStep,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatStepperNext,
    MatStepperPrevious,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatChipInput,
    MatChipRemove,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatError
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  private fb = inject(FormBuilder)
  private store = inject(Store)
  readonly interestsArray = signal<string[]>([]);

  basicInfo = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/), Validators.minLength(9), Validators.maxLength(9)]],
  });
  interests = this.fb.control([]);

  remove(item: string) {
    this.interestsArray.update(interests => interests.filter(i => i !== item));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if (value && !this.interestsArray().includes(value)) {
      this.interestsArray.update(interests => [...interests, value]);
    }

    if (input) {
      input.value = '';
    }
  }

  save(){
    if(this.basicInfo.invalid) {
      alert('Uzupełnij wszystkie wymagane pola!');
      return;
    } else {
      const newCustomer = {
        first_name: this.basicInfo.value.first_name!,
        last_name: this.basicInfo.value.last_name!,
        phone: this.basicInfo.value.phone!,
        interests: this.interestsArray()
      }
      this.store.dispatch(createCustomer(newCustomer));
    }

  }

}
