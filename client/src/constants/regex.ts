const REGEX = {
  EMAIL: new RegExp('^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$'),
  // CHANENL: ↓↓↓ path parameter에서 커뮤니티 아이디와 채널 아이디를 뽑는다
  CHANNEL: /\/communities\/(?<communityId>\w+)\/channels\/(?<roomId>\w+)/u,
};

export default REGEX;
