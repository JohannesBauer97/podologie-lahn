import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeistungenComponent} from './leistungen.component';

describe('LeistungenComponent', () => {
  let component: LeistungenComponent;
  let fixture: ComponentFixture<LeistungenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeistungenComponent]
    });
    fixture = TestBed.createComponent(LeistungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
