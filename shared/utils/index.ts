export type CommonFn = () => 'TEST';

const commonFn: CommonFn = () => {
  console.log('TEST');
  return 'TEST';
};

export default commonFn;
