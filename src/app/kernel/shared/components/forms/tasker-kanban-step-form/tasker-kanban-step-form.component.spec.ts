import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerKanbanStepFormComponent } from './tasker-kanban-step-form.component';

describe('TaskerKanbanStepFormComponent', () => {
  let component: TaskerKanbanStepFormComponent;
  let fixture: ComponentFixture<TaskerKanbanStepFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerKanbanStepFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskerKanbanStepFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
