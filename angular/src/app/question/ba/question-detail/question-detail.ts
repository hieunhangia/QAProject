import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ConfigStateService } from '@abp/ng.core';
import { User, Ba } from 'src/app/proxy';
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
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-question-detail',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    RouterModule,
    ScrollerModule,
    PopoverModule,
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
  private baService = inject(Ba.Questions.BaQuestionService);
  private readonly toaster = inject(ToasterService);
  questionId: string = this.route.snapshot.paramMap.get('id');
  recentQuestion: User.Questions.QuestionDetailDto;
  name: string;
  editingMessageId: string | null = null;
  editingContent = '';
  historyUpdateMessages: string[] = [];
  titleUpdate: string;
  contentUpdate: string;
  status: QaStatus;
  QaStatus = QaStatus; // expose enum to template

  ngOnInit(): void {
    this.id = this.configState.getOne('currentUser').id as string;
    this.loadQuestionDetail();
    this.name = this.configState.getOne('currentUser').name as string;
  }

  loadQuestionDetail() {
    this.baService
      .getQuestionDetail(this.questionId)
      .subscribe((res: User.Questions.QuestionDetailDto) => {
        this.recentQuestion = res;
        this.status = res.status;
      })
  }

  // Kiểm tra xem còn time để edit ko
  canEdit(msg: User.Questions.MessageDto) {
    const oneHour = 60 * 60 * 1000; // 1 tiếng tính bằng mili giây
    const createdTime = new Date(msg.creationTime).getTime();
    const now = new Date().getTime();

    return (msg.creatorId === this.id) && ((now - createdTime) <= oneHour);
  }

  startEdit(msg: User.Questions.MessageDto) {
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
    this.baService.updateMessage(messageId, { content }).subscribe({
      next: () => {
        this.toaster.success('Message updated successfully.', 'Success');
        this.editingMessageId = null;
        this.loadQuestionDetail();
      },
      error: (err) => {
        this.toaster.error(err.error?.error?.message, 'Error');
      }
    })
  }

  //Hàm gửi message
  addMessage(questionId: string, input: User.Questions.CreateUpdateMessageDto) {
    this.baService.sendMessage(questionId, input).subscribe({
      next: () => {
        this.loadQuestionDetail();
      },
      error: (err) => {
        this.toaster.error(err.error?.error?.message, 'Error')
      }
    })
  }

  //Hàm kiểm tra xem có history messages 
  checkHistoryMessages(msgId: string) {
    const check = this.recentQuestion.messages.find(m => m.id === msgId).contentUpdateHistory;
    if (check.length === 0) {
      return false;
    }
    else {
      this.historyUpdateMessages = check;
      return true;
    }
  }

}
