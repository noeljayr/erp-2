import type { UserTypes } from './userTypes';

export type RequestTypes = {
  id: string;
  request_id: string;
  request_number: number;
  requested_by: UserTypes;
  amount: string;
  currency: string;
  approver_id: string;
  purpose: string;
  description: string;
  required_on: string | null;
  status: string;
  initiated_on: string;
  approver: UserTypes;
};
