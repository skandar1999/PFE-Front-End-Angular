import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyadminComponent } from './onlyadmin.component';

describe('OnlyadminComponent', () => {
  let component: OnlyadminComponent;
  let fixture: ComponentFixture<OnlyadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlyadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
