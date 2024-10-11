import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectButtonFormComponent } from './add-project-button-form.component';

describe('AddProjectButtonFormComponent', () => {
  let component: AddProjectButtonFormComponent;
  let fixture: ComponentFixture<AddProjectButtonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectButtonFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProjectButtonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
