import { TestBed } from '@angular/core/testing';

import { AssociationService } from './association.service';

describe('AssociationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssociationService = TestBed.get(AssociationService);
    expect(service).toBeTruthy();
  });
});
