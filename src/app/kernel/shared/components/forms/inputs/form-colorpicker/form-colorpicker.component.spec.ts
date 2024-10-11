import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormColorpickerComponent } from './form-colorpicker.component';

describe('FormColorpickerComponent', () => {
  let component: FormColorpickerComponent;
  let fixture: ComponentFixture<FormColorpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormColorpickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormColorpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
