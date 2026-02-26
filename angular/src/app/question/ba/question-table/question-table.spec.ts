import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTable } from './question-table';

describe('QuestionTable', () => {
  let component: QuestionTable;
  let fixture: ComponentFixture<QuestionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
