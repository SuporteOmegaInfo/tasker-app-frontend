import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextToInputComponent } from './form-text-to-input.component';

describe('FormTextToInputComponent', () => {
  let component: FormTextToInputComponent;
  let fixture: ComponentFixture<FormTextToInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextToInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTextToInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
