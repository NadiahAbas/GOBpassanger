
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationPage } from './booking-confirmation.page';

describe('BookingconfirmationPage', () => {
  let component: BookingConfirmationPage;
  let fixture: ComponentFixture<BookingConfirmationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingConfirmationPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
