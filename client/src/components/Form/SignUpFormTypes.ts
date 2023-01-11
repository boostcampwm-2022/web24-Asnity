import type { SignUpRequest } from '@apis/auth';

export interface SignUpFormFields extends SignUpRequest {
  passwordCheck: string;
}
