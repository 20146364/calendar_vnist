import { TestBed } from '@angular/core/testing';

import { CreatorEditorService } from './creator-editor.service';

describe('CreatorEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatorEditorService = TestBed.get(CreatorEditorService);
    expect(service).toBeTruthy();
  });
});
