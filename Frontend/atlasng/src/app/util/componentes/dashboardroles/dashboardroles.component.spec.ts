import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardrolesComponent } from './dashboardroles.component';

describe('DashboardrolesComponent', () => {
  let component: DashboardrolesComponent;
  let fixture: ComponentFixture<DashboardrolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardrolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
