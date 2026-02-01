import type { CreateQuestionDto, CreateUpdateMessageDto, GetListQuestionsDto, QuestionDetailDto, QuestionSummaryDto, UpdateQuestionDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { QaStatus } from '../../questions/qa-status.enum';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  addMessage = (questionId: string, input: CreateUpdateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/question/message/${questionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateQuestionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionDetailDto>({
      method: 'POST',
      url: '/api/app/question',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionDetailDto>({
      method: 'GET',
      url: `/api/app/question/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListQuestionsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionSummaryDto>>({
      method: 'GET',
      url: '/api/app/question',
      params: { q: input.q, status: input.status, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateQuestionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionDetailDto>({
      method: 'PUT',
      url: `/api/app/question/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateMessage = (messageId: string, input: CreateUpdateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/question/message/${messageId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateStatus = (id: string, status: QaStatus, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/question/${id}/status`,
      params: { status },
    },
    { apiName: this.apiName,...config });
}