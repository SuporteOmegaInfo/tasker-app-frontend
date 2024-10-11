import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChecklistItemComponent } from './add-checklist-item.component';

describe('AddChecklistItemComponent', () => {
  let component: AddChecklistItemComponent;
  let fixture: ComponentFixture<AddChecklistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChecklistItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
