import {Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Store} from '@ngrx/store';
import {createCustomer} from '../../store/customers/customers.actions';
import {CustomerBasicInfoFormInterface} from '../../store/customers/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasicInfoStepComponent} from './components/basic-info-step/basic-info-step.component';
import {InterestsStepComponent} from './components/interests-step/interests-step.component';
import {SummaryStepComponent} from './components/summary-step/summary-step.component';

@Component({
  selector: 'app-add-customer',
  imports: [
    RouterLink,
    MatButton,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatStepperNext,
    MatStepperPrevious,
    MatIcon,
    BasicInfoStepComponent,
    InterestsStepComponent,
    SummaryStepComponent
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  private store = inject(Store)
  private _snackBar = inject(MatSnackBar);

  basicInfo = new FormGroup<CustomerBasicInfoFormInterface>({
    first_name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    last_name: new FormControl<string>('', {nonNullable: true,validators: [Validators.required, Validators.minLength(3)] }),
    phone: new FormControl<string>('', {nonNullable: true,validators: [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/), Validators.minLength(9), Validators.maxLength(9)] })
  });
  interests = new FormControl<string[]>([], {nonNullable: true})

  onRemoveInterest(item: string): void {
    const currentInterests = this.interests.value;
    const updatedInterests = currentInterests.filter(i => i != item);
    this.interests.setValue(updatedInterests);
    this.interests.markAsTouched();
    this._snackBar.open('Zainteresowanie zostało usunięte')
  }

  onAddInterest(value: string): void {
    const currentInterests = this.interests.value;

    if(value) {
      if(currentInterests.includes(value)) {
        this._snackBar.open('Zainteresowanie już zostało dodane')
        return
      }
      this.interests.setValue([...currentInterests, value]);
      this._snackBar.open('Dodano zainteresowanie')
    } else {
      this._snackBar.open('Najpierw wpisz cokolwiek' )
    }
  }

  save(): void{
    if(this.basicInfo.invalid) {
      this._snackBar.open('Uzupełnij wszystkie wymagane pola!')
      return;
    } else {
      const newCustomer = {
        first_name: this.basicInfo.getRawValue().first_name,
        last_name: this.basicInfo.getRawValue().last_name,
        phone: this.basicInfo.getRawValue().phone,
        interests: this.interests.value
      }
      this.store.dispatch(createCustomer(newCustomer));
    }
  }
}
