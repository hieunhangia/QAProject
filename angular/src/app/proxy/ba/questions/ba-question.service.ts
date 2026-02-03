import type { GetQuestionListInput, QuestionDto, SendMessageDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { CreateUpdateMessageDto, MessageDto } from '../../user/questions/models';

@Injectable({
  providedIn: 'root',
})
export class BaQuestionService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  getListQuestion = (input: GetQuestionListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionDto>>({
      method: 'GET',
      url: '/api/app/ba-question/question',
      params: { status: input.status, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getMessages = (questionId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageDto[]>({
      method: 'GET',
      url: `/api/app/ba-question/messages/${questionId}`,
    },
    { apiName: this.apiName,...config });
  

  sendMessage = (input: SendMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageDto>({
      method: 'POST',
      url: '/api/app/ba-question/send-message',
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