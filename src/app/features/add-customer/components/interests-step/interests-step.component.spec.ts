import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestsStepComponent } from './interests-step.component';

describe('InterestsStepComponent', () => {
  let component: InterestsStepComponent;
  let fixture: ComponentFixture<InterestsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
