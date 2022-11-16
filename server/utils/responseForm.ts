export const responseForm = (statusCode: number, data: Record<string, any>) => {
  return {
    statusCode,
    result: {
      ...data,
    },
  };
};
