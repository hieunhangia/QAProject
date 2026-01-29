import type { AssigneeDto, GetAssigneeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssigneeService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssigneeDto>({
      method: 'GET',
      url: `/api/user/assignee/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetAssigneeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssigneeDto>>({
      method: 'GET',
      url: '/api/user/assignees',
      params: { assigneeName: input.assigneeName, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
}