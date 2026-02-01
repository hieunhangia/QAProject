import { Component, inject, OnInit, Input } from '@angular/core';
import { User } from '../../proxy';
import { type PagedResultDto } from '@abp/ng.core';
import { QaStatus } from '../../proxy/questions';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToasterService } from '@abp/ng.theme.shared';


@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [ButtonModule, TableModule, TagModule, CardModule, AvatarModule, RouterModule, CommonModule, SelectButtonModule, TooltipModule, MenuModule],
  templateUrl: './question-table.html',
  styleUrl: './question-table.scss'
})

export class QuestionTable implements OnInit {
  @Input() mode: 'open' | 'closed' = 'open'
  private questionService = inject(User.Questions.QuestionService);
  recentQuestions: User.Questions.QuestionSummaryDto[] = [];
  totalQuestions = 0;
  loading = true;
  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  ngOnInit(): void {
    const routeMode = this.route.snapshot.data['mode'];
    if (routeMode) {
      this.mode = routeMode;
    }
  }

  getMenuItems(questionId: string): MenuItem[] {
    return [
      {
        label: 'Detail',
        icon: 'pi pi-eye',
        command: () => this.viewDetail(questionId)
      },
      {
        label: 'Re-Open',
        icon: 'pi pi-refresh',
        command: () => this.reOpenQuestion(questionId)
      }
    ];
  }

  viewDetail(id: string) {
    console.log('Viewing detail:', id);
    // Logic để xem chi tiết question
  }

  loadQuestion(skipCount: number, maxResultCount: number) {
    this.loading = true;
    const status = this.mode === 'open' ? QaStatus.Open : QaStatus.Closed;
    this.questionService
      .getList({ maxResultCount, skipCount, sorting: 'lastModificationTime DESC', status: status })
      .subscribe((res: PagedResultDto<User.Questions.QuestionSummaryDto>) => {
        const items = res.items ?? [];
        this.recentQuestions = items.filter(item => item.status === status);
        this.totalQuestions = res.totalCount ?? 0;
        this.loading = false;
      });
  }

  onPageChange(event: { first: number; rows: number }) {
    this.loadQuestion(event.first, event.rows);
  }

  reOpenQuestion(id: string) {
    this.questionService.updateStatus(id, QaStatus.Open).subscribe({
      next: () => {
        this.toaster.success('Question re-opened successfully.', 'Success');
        this.loadQuestion(0, 10);
      },
      error: () => {
        this.toaster.error('Failed to re-open question. Please try again.', 'Error');
      }
    })
  }
}
