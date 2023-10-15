export interface ResponseWebSuccess {
  status: string;
  message: string;
  statusCode: number;
  data: any;
}

export interface ResponseWebError {
  status: string;
  statusCode: number;
  message: string;
}
