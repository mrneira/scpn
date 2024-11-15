/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VisorPdfComponent } from './visorPdf.component';

describe('JasperComponent', () => {
  let component: VisorPdfComponent;
  let fixture: ComponentFixture<VisorPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
