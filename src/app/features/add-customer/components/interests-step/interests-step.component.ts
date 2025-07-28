import {Component, input, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-interests-step',
  imports: [
    MatFormField,
    MatLabel,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatChipInput,
    MatChipRemove,
    ReactiveFormsModule,
  ],
  templateUrl: './interests-step.component.html',
  styleUrl: './interests-step.component.scss'
})
export class InterestsStepComponent {
  readonly interestsControl = input.required<FormControl<string[]>>()

  readonly removeInterest = output<string>();
  readonly addInterest = output<string>();

  onRemoveInterest(item: string) {
    this.removeInterest.emit(item);
  }

  onAddInterest(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value = event.value.trim();

    if(value) {
      this.addInterest.emit(value);
      input.value = '';
    }
  }
}
