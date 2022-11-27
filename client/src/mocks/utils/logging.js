export const colorLog = (message, textColor) => {
  textColor = textColor ? `color: ${textColor}` : `color: #bada55`;
  console.log(`%c${message}`, textColor);
};
