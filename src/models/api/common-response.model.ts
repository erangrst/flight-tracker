export interface CommonResponseModel<T> {
  success: boolean;
  message?: string;
  data?: T;
}
