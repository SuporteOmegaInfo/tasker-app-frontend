import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerKanbanComponent } from './tasker-kanban.component';

describe('TaskerKanbanComponent', () => {
  let component: TaskerKanbanComponent;
  let fixture: ComponentFixture<TaskerKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerKanbanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskerKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
