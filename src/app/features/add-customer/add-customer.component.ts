import {Component, computed, inject, signal, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Store} from '@ngrx/store';
import {createCustomer, saveBasicInfo, saveInterests, clearFormData, initializeFormData} from '../../store/customers/customers.actions';
import {CustomerBasicInfoFormInterface} from '../../store/customers/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasicInfoStepComponent} from './components/basic-info-step/basic-info-step.component';
import {InterestsStepComponent} from './components/interests-step/interests-step.component';
import {SummaryStepComponent} from './components/summary-step/summary-step.component';
import { Subject, takeUntil, take } from 'rxjs';
import {
  selectBasicInfo,
  selectInterests,
  selectIsFormInitialized,
  selectCompleteCustomerData
} from '../../store/customers/customers.selectors';

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
export class AddCustomerComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private _snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  basicInfo = new FormGroup<CustomerBasicInfoFormInterface>({
    first_name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    last_name: new FormControl<string>('', {nonNullable: true,validators: [Validators.required, Validators.minLength(3)] }),
    phone: new FormControl<string>('', {nonNullable: true,validators: [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/), Validators.minLength(9), Validators.maxLength(9)] })
  });
  interests = new FormControl<string[]>([], {nonNullable: true});

  ngOnInit(): void {
    this.initializeFromLocalStorage();

    this.store.select(selectIsFormInitialized)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isInitialized => {
        if (isInitialized) {
          this.loadFormDataFromStore();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeFromLocalStorage(): void {
    const savedData = localStorage.getItem('customerFormData');
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        this.store.dispatch(initializeFormData(formData));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }

  private loadFormDataFromStore(): void {
    this.store.select(selectBasicInfo)
      .pipe(take(1))
      .subscribe(basicInfo => {
        if (basicInfo.first_name || basicInfo.last_name || basicInfo.phone) {
          this.basicInfo.patchValue(basicInfo, { emitEvent: false });
        }
      });

    this.store.select(selectInterests)
      .pipe(take(1))
      .subscribe(interests => {
        if (interests.length > 0) {
          this.interests.setValue(interests, { emitEvent: false });
        }
      });
  }

  onBasicInfoStepNext(): void {
    if (this.basicInfo.valid) {
      const basicInfoData = this.basicInfo.getRawValue();
      this.store.dispatch(saveBasicInfo(basicInfoData));
      this._snackBar.open('Dane podstawowe zostały zapisane', 'OK', { duration: 2000 });
    }
  }

  onInterestsStepNext(): void {
    const interestsData = this.interests.value;
    this.store.dispatch(saveInterests(interestsData));
    this._snackBar.open('Zainteresowania zostały zapisane', 'OK', { duration: 2000 });
  }

  onRemoveInterest(item: string): void {
    const currentInterests = this.interests.value;
    const updatedInterests = currentInterests.filter(i => i != item);
    this.interests.setValue(updatedInterests);
    this.interests.markAsTouched();

    this.store.dispatch(saveInterests(updatedInterests));
    this._snackBar.open('Zainteresowanie zostało usunięte', 'OK', { duration: 2000 });
  }

  onAddInterest(value: string): void {
    const currentInterests = this.interests.value;

    if(value) {
      if(currentInterests.includes(value)) {
        this._snackBar.open('Zainteresowanie już zostało dodane', 'OK', { duration: 2000 });
        return;
      }
      const updatedInterests = [...currentInterests, value];
      this.interests.setValue(updatedInterests);

      this.store.dispatch(saveInterests(updatedInterests));
      this._snackBar.open('Dodano zainteresowanie', 'OK', { duration: 2000 });
    } else {
      this._snackBar.open('Najpierw wpisz cokolwiek', 'OK', { duration: 2000 });
    }
  }

  save(): void {
    if(this.basicInfo.invalid) {
      this._snackBar.open('Uzupełnij wszystkie wymagane pola!', 'OK', { duration: 3000 });
      return;
    } else {
      this.store.select(selectCompleteCustomerData)
        .pipe(take(1))
        .subscribe(storeData => {
          const newCustomer = {
            first_name: storeData.first_name || this.basicInfo.getRawValue().first_name,
            last_name: storeData.last_name || this.basicInfo.getRawValue().last_name,
            phone: storeData.phone || this.basicInfo.getRawValue().phone,
            interests: storeData.interests.length > 0 ? storeData.interests : this.interests.value
          };
          this.store.dispatch(createCustomer(newCustomer));
        });
    }
  }

  clearForm(): void {
    this.store.dispatch(clearFormData());
    this.basicInfo.reset();
    this.interests.reset();
    this._snackBar.open('Formularz został wyczyszczony', 'OK', { duration: 2000 });
  }
}
