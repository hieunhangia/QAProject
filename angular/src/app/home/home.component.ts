import { Component, inject } from '@angular/core';
import { AuthService, ConfigStateService, type ApplicationConfigurationDto, type PagedResultDto } from '@abp/ng.core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../proxy';
import { QaStatus } from '../proxy/questions/qa-status.enum';
import { HomeUser } from '../home-user/home-user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ButtonModule, TableModule, TagModule, CardModule, AvatarModule, HomeUser]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private configState = inject(ConfigStateService);

  currentUser?: ApplicationConfigurationDto['currentUser']; // Khai báo DTO cho biến dựa trên ApplicationConfigurationDto['currentUser']
  roles: string[];
  readonly QaStatus = QaStatus;

  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  constructor() {
    // Lấy thông tin user hiện tại từ ConfigState
    this.currentUser = this.configState.getOne('currentUser') as ApplicationConfigurationDto['currentUser'];
    this.roles = this.currentUser.roles;
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
