import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { GetListQuestionsDto, QuestionDetailDto, QuestionSummaryDto } from '../../user/questions/models';

@Injectable({
  providedIn: 'root',
})
export class AdminQuestionService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionDetailDto>({
      method: 'GET',
      url: `/api/app/admin-question/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListQuestionsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuestionSummaryDto>>({
      method: 'GET',
      url: '/api/app/admin-question',
      params: { q: input.q, status: input.status, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
}