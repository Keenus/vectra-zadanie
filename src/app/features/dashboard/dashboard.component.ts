import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {debounceTime, Observable} from 'rxjs';
import {loadCustomers, setSearchTerm, sortCustomers} from '../../store/customers/customers.actions';
import {CustomerInterface} from '../../store/customers/customer.model';
import {Store} from '@ngrx/store';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {
  selectCustomersError,
  selectCustomersLoading,
  selectFilteredCustomers
} from '../../store/customers/customers.selectors';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatSort,
    MatSortHeader,
    MatFormField,
    MatInput,
    MatIconButton,
    MatSuffix,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  private store = inject(Store)

  customers: Observable<CustomerInterface[]>;
  isLoading: Observable<boolean>;
  error: Observable<string | null>;

  columns: string[] = ['id', 'first_name', 'last_name', 'phone', 'interests'];

  searchTerm = signal<string>('');
  searchQuery = toSignal<string>(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      map(term => term.trim().toLowerCase())
    )
  )

  constructor() {
    this.customers = this.store.select(selectFilteredCustomers);
    this.isLoading = this.store.select(selectCustomersLoading);
    this.error = this.store.select(selectCustomersError);

    effect(() => {
      const term = this.searchQuery();
      this.store.dispatch(setSearchTerm(term));
    });
  }

  ngOnInit() {
    this.store.dispatch(loadCustomers());
  }

  search(event: Event): void{
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  announceSortChange(sortState: Sort): void {
    this.store.dispatch(sortCustomers({ active: sortState.active, direction: sortState.direction? sortState.direction : 'asc' }));
  }

}
