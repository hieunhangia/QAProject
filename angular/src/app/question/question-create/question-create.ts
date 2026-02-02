import { Component, inject } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToasterService } from '@abp/ng.theme.shared';
import { User } from '../../proxy';
import { CreateQuestionDto } from 'src/app/proxy/user/questions';
import { AssigneeService } from '../../proxy/user/assignees/assignee.service';
import { AssigneeDto } from '../../proxy/user/assignees';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    AutoCompleteModule,
    AvatarModule,
    ButtonModule
  ],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss'
})
export class QuestionCreate {
  private readonly assigneeService = inject(AssigneeService);
  private readonly questionService = inject(User.Questions.QuestionService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  submitting = false;

  assignees: AssigneeDto[] = [];
  selectedAssignee: AssigneeDto | null = null;

  questionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    assigneeId: ['', [Validators.required]]
  });

  searchAssignee(event: { query: string }) {
    const query = event.query?.trim() ?? '';
    this.assigneeService
      .getList({
        maxResultCount: 5,
        assigneeName: query
      })
      .subscribe(res => {
        this.assignees = res.items ?? [];
      });
  }

  onAssigneeSelect(event: { value: AssigneeDto }) {
    const assignee = event.value;
    this.selectedAssignee = assignee;
    this.questionForm.patchValue({ assigneeId: assignee.id });
  }

  onAssigneeClear() {
    this.selectedAssignee = null;
    this.questionForm.patchValue({ assigneeId: '' });
  }

  onSubmit() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched(); //Đánh dấu tất cả các field trong questionForm là touched
      return;
    }
    this.submitting = true;
    const input = this.questionForm.getRawValue() as CreateQuestionDto;
    this.questionService.create(input).subscribe({
      next: () => {
        this.toaster.success('Question created successfully.', 'Success');
        this.router.navigate(['/question/list']);
      },
      error: () => {
        this.submitting = false;
        this.toaster.error('Failed to create question. Please try again.', 'Error');
      }
    });
  }
}
