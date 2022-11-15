export const responseForm = (statusCode: number, data: any) => {
  return {
    statusCode,
    result: data,
  };
};
