import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../proxy';
import { type PagedResultDto } from '@abp/ng.core';
import { QaStatus } from '../../../proxy/questions';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToasterService } from '@abp/ng.theme.shared';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    CardModule,
    AvatarModule,
    CommonModule,
    FormsModule,
    SelectButtonModule,
    InputTextModule,
    SelectModule,
    TooltipModule,
    MenuModule,
    ConfirmDialogModule,
    RouterModule,
  ],
  templateUrl: './question-table.html',
  styleUrl: './question-table.scss'
})

export class QuestionTable implements OnInit, OnDestroy {
  private questionService = inject(User.Questions.QuestionService);
  recentQuestions: User.Questions.QuestionSummaryDto[] = [];
  totalQuestions = 0;
  loading = true;
  private readonly toaster = inject(ToasterService);
  private router = inject(Router);

  // Filter properties
  searchQuery = '';
  selectedStatus: QaStatus | null = null;
  selectedSort: string = 'lastModificationTime ?? creationTime DESC'
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  // Status options for dropdown
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Open', value: QaStatus.Open },
    { label: 'Closed', value: QaStatus.Closed }
  ];

  // Time options for dropdown
  sortOptions = [
    { label: 'Lastest', value: 'lastModificationTime ?? creationTime DESC' },
    { label: 'Oldest', value: 'lastModificationTime ?? creationTime ASC' },
    { label: 'Topic DESC', value: 'Title DESC, creationTime DESC' },
    { label: 'Topic ASC', value: 'Title ASC, creationTime DESC' },
    { label: 'Description DESC', value: 'Content DESC, creationTime DESC' },
    { label: 'Description ASC', value: 'Content ASC, creationTime DESC' },
  ];

  constructor() {
    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadQuestion(0, 10);
    });
  }

  ngOnInit(): void {
    // Load initial data
    this.loadQuestion(0, 10);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewDetail(id: string) {
    this.router.navigate(['question', 'detail', id]);
  }

  loadQuestion(skipCount: number, maxResultCount: number) {
    this.loading = true;
    const params: User.Questions.GetListQuestionsDto = {
      maxResultCount,
      skipCount,
      sorting: this.selectedSort,
      q: this.searchQuery?.trim() || null,
      status: this.selectedStatus
    };

    this.questionService
      .getList(params)
      .subscribe((res: PagedResultDto<User.Questions.QuestionSummaryDto>) => {
        const items = res.items ?? [];
        this.recentQuestions = items;
        this.totalQuestions = res.totalCount ?? 0;
        this.loading = false;
      });
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onSortsChange() {
    this.loadQuestion(0, 10);
  }

  onPageChange(event: { first: number; rows: number }) {
    this.loadQuestion(event.first, event.rows);
  }
}
