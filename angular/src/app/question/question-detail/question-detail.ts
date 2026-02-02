import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ConfigStateService, type ApplicationAuthConfigurationDto } from '@abp/ng.core';
import { User } from 'src/app/proxy';
import { MessageDto } from 'src/app/proxy/user/questions';
import { QuestionDetailDto } from 'src/app/proxy/user/questions';
import { ScrollerModule } from 'primeng/scroller';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CreateUpdateMessageDto } from 'src/app/proxy/user/questions';
import { ToasterService } from '@abp/ng.theme.shared';
import { QaStatus } from 'src/app/proxy/questions';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ScrollerModule,
    AvatarModule,
    ButtonModule,
    TextareaModule,
    TooltipModule,
    MenuModule,
    TagModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './question-detail.html',
  styleUrl: './question-detail.scss'
})
export class QuestionDetail implements OnInit {
  private configState = inject(ConfigStateService);
  private id: string; // id của user hiện tại
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private questionService = inject(User.Questions.QuestionService);
  private readonly toaster = inject(ToasterService);
  private confirmationService = inject(ConfirmationService);
  questionId: string = this.route.snapshot.paramMap.get('id');
  recentQuestion: User.Questions.QuestionDetailDto;
  name: string;
  status: QaStatus;
  QaStatus = QaStatus; // expose enum to template
  editingMessageId: string | null = null;
  editingContent = '';

  ngOnInit(): void {
    this.id = this.configState.getOne('currentUser').id as string;
    this.loadQuestionDetail();
    this.name = this.configState.getOne('currentUser').name as string;
  }

canEdit(msg: MessageDto) {
    const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng mili giây
    const createdTime = new Date(msg.creationTime).getTime();
    const now = new Date().getTime();

    return (msg.creatorId === this.id) && ((now - createdTime) <= oneHour);
  }

  startEdit(msg: MessageDto) {
    this.editingMessageId = msg.id;
    this.editingContent = msg.content || '';
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.editingContent = '';
  }

  saveEdit(messageId: string) {
    const content = this.editingContent?.trim();
    if (!content) return;
    this.questionService.updateMessage(messageId, { content }).subscribe({
      next: () => {
        this.toaster.success('Message updated successfully.', 'Success');
        this.editingMessageId = null;
        this.loadQuestionDetail();
      },
      error: (err) => {
        this.toaster.error(err.error?.error?.message || 'Failed to update message.', 'Error');
      }
    });
  }

  updateMessage(messageId: string, input: CreateUpdateMessageDto) {
    this.questionService.updateMessage(messageId, input).subscribe({
      next: () => {
        this.toaster.success('Message updated successfully.', 'Success');
        this.loadQuestionDetail();
      },
      error: (err) => {
        this.toaster.error(err.error?.error?.message, 'Error')
      }
    })
  }

  addMessage(messageId: string, input: CreateUpdateMessageDto) {
    this.questionService.addMessage(messageId, input).subscribe({
      next: () => {
        this.loadQuestionDetail();
      },
      error: (err) => {
        this.toaster.error(err.error?.error?.message, 'Error')
      }
    })
  }

  closedQuestion(id: string) {
    if (this.status !== QaStatus.Open) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Close Question',
      message: 'Are you sure you want to close this question?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Close',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'btn-confirm-primary',
      rejectButtonStyleClass: 'btn-confirm-secondary p-button-text',
      accept: () => {
        this.questionService.updateStatus(id, QaStatus.Closed).subscribe({
          next: () => {
            this.toaster.success('Question closed successfully.', 'Success');
            this.loadQuestionDetail();
            this.router.navigate(['/question', 'list']);
          },
          error: () => {
            this.toaster.error('Failed to closed question. Please try again.', 'Error');
          }
        });
      }
    });
  }

  reOpenQuestion(id: string) {
    if (this.status !== QaStatus.Closed) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Re-Open Question',
      message: 'Are you sure you want to re-open this question?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Re-Open',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'btn-confirm-primary',
      rejectButtonStyleClass: 'btn-confirm-secondary p-button-text',
      accept: () => {
        this.questionService.updateStatus(id, QaStatus.Open).subscribe({
          next: () => {
            this.toaster.success('Question re-opened successfully.', 'Success');
            this.loadQuestionDetail();
          },
          error: (err) => {
            this.toaster.error(err.error?.error?.message || 'Failed to re-open question. Please try again.', 'Error');
          }
        });
      }
    });
  }

  loadQuestionDetail() {
    this.questionService
      .get(this.questionId)
      .subscribe((res: QuestionDetailDto) => {
        this.recentQuestion = res;
        this.status = res.status;
      });
  }

}
