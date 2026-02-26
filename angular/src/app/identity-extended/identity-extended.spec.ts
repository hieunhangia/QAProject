import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityExtended } from './identity-extended';

describe('IdentityExtended', () => {
  let component: IdentityExtended;
  let fixture: ComponentFixture<IdentityExtended>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityExtended]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentityExtended);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
