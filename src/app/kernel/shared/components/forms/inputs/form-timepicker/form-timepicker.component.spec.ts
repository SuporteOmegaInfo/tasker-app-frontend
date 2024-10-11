import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTimepickerComponent } from './form-timepicker.component';

describe('FormTimepickerComponent', () => {
  let component: FormTimepickerComponent;
  let fixture: ComponentFixture<FormTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTimepickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
