import type { GetQuestionListInput, QuestionDto, SendMessageDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { MessageDto } from '../../user/questions/models';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  getListQuestion = (input: GetQuestionListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionDto>>({
      method: 'GET',
      url: '/api/app/question/question',
      params: { assigneeId: input.assigneeId, status: input.status, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  sendMessage = (input: SendMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageDto>({
      method: 'POST',
      url: '/api/app/question/send-message',
      body: input,
    },
    { apiName: this.apiName,...config });
}