import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { QaStatus } from '../../questions/qa-status.enum';

export interface GetQuestionListInput extends PagedAndSortedResultRequestDto {
  assigneeId?: string | null;
  status?: QaStatus | null;
}

export interface QuestionDto extends AuditedEntityDto<string> {
  title?: string;
  content?: string;
  assigneeId?: string | null;
  assigneeName?: string;
  status?: QaStatus;
}

export interface SendMessageDto {
  questionId?: string;
  content: string;
}
