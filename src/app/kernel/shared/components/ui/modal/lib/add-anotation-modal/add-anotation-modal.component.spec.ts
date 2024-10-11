import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnotationModalComponent } from './add-anotation-modal.component';

describe('AddAnotationModalComponent', () => {
  let component: AddAnotationModalComponent;
  let fixture: ComponentFixture<AddAnotationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnotationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAnotationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
