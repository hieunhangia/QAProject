import { Component, inject } from '@angular/core';
import { AuthService, ConfigStateService, LocalizationPipe, type ApplicationConfigurationDto, type PagedResultDto } from '@abp/ng.core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../proxy';
import { QaStatus } from '../proxy/questions/qa-status.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ButtonModule, TableModule, TagModule, CardModule, AvatarModule]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private configState = inject(ConfigStateService);
  private questionService = inject(User.Questions.QuestionService);

  currentUser?: ApplicationConfigurationDto['currentUser'];
  recentQuestions: User.Questions.QuestionSummaryDto[] = [];

  // Dashboard metrics
  totalQuestions = 0;
  assignedToMe = 0;
  totalResolved = 0;

  readonly QaStatus = QaStatus;

  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  constructor() {
    // Lấy thông tin user hiện tại từ ConfigState
    this.currentUser = this.configState.getOne('currentUser') as ApplicationConfigurationDto['currentUser'];

    // Nếu đã đăng nhập thì load dữ liệu Question cho dashboard
    if (this.hasLoggedIn) {
      this.questionService
        .getList({ maxResultCount: 5, skipCount: 0, sorting: 'lastModificationTime DESC' })
        .subscribe((res: PagedResultDto<User.Questions.QuestionSummaryDto>) => {
          const items = res.items ?? [];

          this.recentQuestions = items;
          this.totalQuestions = res.totalCount ?? items.length;

          const currentUserName = this.currentUser?.userName?.toLowerCase();
          this.assignedToMe = items.filter(q => q.assigneeName?.toLowerCase() === currentUserName).length;
          this.totalResolved = items.filter(q => q.status === QaStatus.Closed).length;
        });
    }
  }

  login() {
    this.authService.navigateToLogin();
  }

  exportExcel() {
    // TODO: bạn có thể gắn API export thực sự; tạm thời log để minh hoạ
    console.log('Export Q&A list to Excel');
  }

  createQA() {
    // TODO: điều hướng tới màn tạo Question thực tế nếu có
    console.log('Navigate to create Question page');
  }
}
