
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePaymentPage } from './change-payment.page';

describe('ChangepaymentPage', () => {
  let component: ChangePaymentPage;
  let fixture: ComponentFixture<ChangePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePaymentPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
