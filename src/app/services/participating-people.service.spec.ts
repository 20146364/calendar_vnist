import { TestBed } from '@angular/core/testing';

import { ParticipatingPeopleService } from './participating-people.service';

describe('ParticipatingPeopleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParticipatingPeopleService = TestBed.get(ParticipatingPeopleService);
    expect(service).toBeTruthy();
  });
});
