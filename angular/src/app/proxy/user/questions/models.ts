import type { AuditedEntityDto, CreationAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { QaStatus } from '../../questions/qa-status.enum';

export interface CreateUpdateMessageDto {
  content: string;
}

export interface GetListQuestionsDto extends PagedAndSortedResultRequestDto {
  q?: string | null;
  status?: QaStatus | null;
}

export interface MessageDto extends CreationAuditedEntityDto<string> {
  content?: string | null;
  creatorName?: string | null;
  contentUpdateHistory?: string[] | null;
}

export interface QuestionDetailDto extends AuditedEntityDto<string> {
  title?: string | null;
  content?: string | null;
  status?: QaStatus;
  closedAt?: string | null;
  assigneeName?: string | null;
  messages?: MessageDto[] | null;
}

export interface QuestionSummaryDto extends AuditedEntityDto<string> {
  title?: string | null;
  content?: string | null;
  status?: QaStatus;
  closedAt?: string | null;
  creatorName?: string | null;
  assigneeName?: string | null;
  lastModifierName?: string | null;
}

export interface CreateQuestionDto {
  title: string;
  content: string;
  assigneeId: string;
}

export interface UpdateQuestionDto {
  title: string;
  content: string;
}
