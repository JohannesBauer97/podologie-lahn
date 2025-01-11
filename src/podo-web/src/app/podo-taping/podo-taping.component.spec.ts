import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PodoTapingComponent} from './podo-taping.component';

describe('PodoTapingComponent', () => {
  let component: PodoTapingComponent;
  let fixture: ComponentFixture<PodoTapingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PodoTapingComponent]
    });
    fixture = TestBed.createComponent(PodoTapingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
