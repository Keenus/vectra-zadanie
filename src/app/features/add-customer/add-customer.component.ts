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
import {createCustomer} from '../../store/customers.actions';
import {CustomerBasicInfoFormInterface} from '../../store/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  private store = inject(Store)
  private _snackBar = inject(MatSnackBar);

  basicInfo = new FormGroup<CustomerBasicInfoFormInterface>({
    first_name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl<string>('', {nonNullable: true,validators: [Validators.required] }),
    phone: new FormControl<string>('', {nonNullable: true,validators: [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/), Validators.minLength(9), Validators.maxLength(9)] })
  });

  interests = new FormControl<string[]>([], {nonNullable: true})

  removeInterest(item: string) {
    const currentInterests = this.interests.value;
    const updatedInterests = currentInterests.filter(i => i != item);
    this.interests.setValue(updatedInterests);
    this.interests.markAsTouched();
    this._snackBar.open('Zainteresowanie zostało usunięte')
  }

  addInterest(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value = event.value.trim();

    const currentInterests = this.interests.value;

    if(value) {
      if(currentInterests.includes(value)) {
        this._snackBar.open('Zainteresowanie już zostało dodane')
        return
      }
      this.interests.setValue([...currentInterests, value]);
      this._snackBar.open('Dodano zainteresowanie')
      input.value = '';
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
