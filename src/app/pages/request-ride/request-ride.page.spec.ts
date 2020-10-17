
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRidePage } from './request-ride.page';

describe('RequestridePage', () => {
  let component: RequestRidePage;
  let fixture: ComponentFixture<RequestRidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestRidePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
