export const responseForm = (statusCode: string, message: string) => {
  return {
    statusCode,
    result: message,
  };
};
