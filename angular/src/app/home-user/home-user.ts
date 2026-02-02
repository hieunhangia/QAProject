import { Component, input } from '@angular/core';
import { QuestionTable } from '../question/question-table/question-table';
import { ApplicationConfigurationDto } from '@abp/ng.core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-user',
  imports: [
    QuestionTable,
    CommonModule,
    QuestionTable,
    CardModule,
    AvatarModule,
    BadgeModule,
    ChipModule,
    ButtonModule
  ],
  templateUrl: './home-user.html',
  styleUrl: './home-user.scss'
})
export class HomeUser {
  currentUser = input<ApplicationConfigurationDto['currentUser']>();

}
