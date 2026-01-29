import { mapEnumToOptions } from '@abp/ng.core';

export enum QaStatus {
  Open = 0,
  Closed = 1,
}

export const qaStatusOptions = mapEnumToOptions(QaStatus);
