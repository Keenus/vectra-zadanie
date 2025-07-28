import {FormControl} from '@angular/forms';

export interface CustomerInterface {
  first_name: string;
  last_name: string;
  phone: string;
  interests: string[];
}

export interface CustomerBasicInfoFormInterface {
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  phone: FormControl<string>;
}
