import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../proxy';
import { type PagedResultDto } from '@abp/ng.core';
import { QaStatus } from '../../proxy/questions';
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
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
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
  providers: [ConfirmationService],
  templateUrl: './question-table.html',
  styleUrl: './question-table.scss'
})

export class QuestionTable implements OnInit, OnDestroy {
  private questionService = inject(User.Questions.QuestionService);
  recentQuestions: User.Questions.QuestionSummaryDto[] = [];
  totalQuestions = 0;
  loading = true;
  private route = inject(ActivatedRoute);
  private readonly toaster = inject(ToasterService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);

  // Filter properties
  searchQuery = '';
  selectedStatus: QaStatus | null = null;
  selectedSort: string  | 'lastModificationTime DESC'
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  QaStatus = QaStatus;

  // Status options for dropdown
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Open', value: QaStatus.Open },
    { label: 'Closed', value: QaStatus.Closed }
  ];

  // Time options for dropdown
  sortOptions = [
    { label: 'Lastest', value: 'lastModificationTime DESC' },
    { label: 'Oldest', value: 'lastModificationTime ASC' },
    { label: 'Topic DESC', value: 'Title DESC' },
    { label: 'Topic ASC', value: 'Title ASC' },
    { label: 'Description DESC', value: 'Content DESC' },
    { label: 'Description ASC', value: 'Content ASC' },
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

  reOpenQuestion(id: string) {
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
            this.loadQuestion(0, 10);
          },
          error: (err) => {
            this.toaster.error(err.error?.error?.message);
          }
        });
      }
    });
  }
}
