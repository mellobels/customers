import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorydetailsComponent } from './historydetails.component';

describe('HistorydetailsComponent', () => {
  let component: HistorydetailsComponent;
  let fixture: ComponentFixture<HistorydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorydetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
