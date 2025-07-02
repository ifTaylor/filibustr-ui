import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePanel } from './vote-panel';

describe('VotePanel', () => {
  let component: VotePanel;
  let fixture: ComponentFixture<VotePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
