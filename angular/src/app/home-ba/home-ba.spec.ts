import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBa } from './home-ba';

describe('HomeBa', () => {
  let component: HomeBa;
  let fixture: ComponentFixture<HomeBa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
