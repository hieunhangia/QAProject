import type { EntityDto, LimitedResultRequestDto } from '@abp/ng.core';

export interface AssigneeDto extends EntityDto<string> {
  name: string;
}

export interface GetAssigneeDto extends LimitedResultRequestDto {
  assigneeName: string;
}
