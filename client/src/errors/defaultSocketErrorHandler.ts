import { toast } from 'react-toastify';

const defaultSocketErrorHandler = (
  errorMessage = '채팅 서버와의 연결이 원활하지 않습니다.',
) => {
  toast.error(errorMessage);
};

export default defaultSocketErrorHandler;
