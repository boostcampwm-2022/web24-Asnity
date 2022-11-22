import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const defaultErrorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorMessage =
      error?.response?.data?.message || '에러가 발생했습니다!';

    if (Array.isArray(errorMessage)) {
      errorMessage.forEach((message) => {
        toast.error(message);
      });
      return;
    }

    toast.error(errorMessage);
    return;
  }

  toast.error('Unknown Error');
};

export default defaultErrorHandler;
