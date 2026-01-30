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
     this.loadQuestion(0, 10);
  }

  loadQuestion(skipCount: number, maxResultCount: number) {
    this.questionService
      .getList({ maxResultCount, skipCount, sorting: 'lastModificationTime DESC' })
      .subscribe((res: PagedResultDto<User.Questions.QuestionSummaryDto>) => {
        const items = res.items ?? [];

        this.recentQuestions = items.filter(item =>{ 
          if(item.status){
            console.log('Tìm thấy status: ' + item.status + 'và === ' + QaStatus.Open) 
          } 
          return item.status === QaStatus.Open
        });
        this.totalQuestions = res.totalCount ?? items.length;
        this.loading = false;
      })
  }

  onPageChange(event: any){
    const skip = event.first; // vị trí record đầu tiên
    const take = event.rows; // số record mỗi trang
    this.loadQuestion(skip, take);
  }
}
