export const responseForm = (statusCode: string, data: any) => {
  return {
    statusCode,
    result: data,
  };
};
