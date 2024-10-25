import { TestBed } from '@angular/core/testing';

import { ProjectStepService } from './project-step.service';

describe('ProjectStepService', () => {
  let service: ProjectStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
