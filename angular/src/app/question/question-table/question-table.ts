import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../proxy';
import { type PagedResultDto } from '@abp/ng.core';
import { QaStatus } from '../../proxy/questions';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-table',
   standalone: true,
  imports: [ButtonModule, TableModule, TagModule, CardModule, AvatarModule, RouterModule, CommonModule],
  templateUrl: './question-table.html',
  styleUrl: './question-table.scss'
})

export class QuestionTable implements OnInit {

  private questionService = inject(User.Questions.QuestionService);
  recentQuestions: User.Questions.QuestionSummaryDto[] = [];
  totalQuestions = 0;
  loading = true;

  ngOnInit(): void {
    // Data load via onLazyLoad khi table init
  }

  loadQuestion(skipCount: number, maxResultCount: number) {
    this.loading = true;
    this.questionService
      .getList({ maxResultCount, skipCount, sorting: 'lastModificationTime DESC' })
      .subscribe((res: PagedResultDto<User.Questions.QuestionSummaryDto>) => {
        const items = res.items ?? [];
        this.recentQuestions = items.filter(item => item.status === QaStatus.Open);
        this.totalQuestions = res.totalCount ?? 0;
        this.loading = false;
      });
  }

  onPageChange(event: { first: number; rows: number }) {
    this.loadQuestion(event.first, event.rows);
  }
}
