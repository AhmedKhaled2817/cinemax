import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerModal } from './trailer-modal';

describe('TrailerModal', () => {
  let component: TrailerModal;
  let fixture: ComponentFixture<TrailerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
