import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { CreateUpdateMessageDto, GetListQuestionsDto, MessageDto, QuestionDetailDto, QuestionSummaryDto } from '../../user/questions/models';

@Injectable({
  providedIn: 'root',
})
export class BaQuestionService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  getListQuestion = (input: GetListQuestionsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionSummaryDto>>({
      method: 'GET',
      url: '/api/app/ba-question/question',
      params: { q: input.q, status: input.status, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getQuestionDetail = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionDetailDto>({
      method: 'GET',
      url: `/api/app/ba-question/${id}/question-detail`,
    },
    { apiName: this.apiName,...config });
  

  sendMessage = (questionId: string, input: CreateUpdateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageDto>({
      method: 'POST',
      url: `/api/app/ba-question/send-message/${questionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateMessage = (messageId: string, input: CreateUpdateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageDto>({
      method: 'PUT',
      url: `/api/app/ba-question/message/${messageId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
}