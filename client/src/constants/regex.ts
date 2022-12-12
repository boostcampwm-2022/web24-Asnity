const REGEX = {
  EMAIL: new RegExp('^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$'),
  CHANNEL: /\/communities\/(?<communityId>\w+)\/channels\/(?<roomId>\w+)/u,
};

export default REGEX;
