/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      height: {
        header: '90px',
      },
    },
    fontSize: {
      s12: ['12px', '18px'],
      s14: ['14px', '24px'],
      s16: ['16px', '26px'],
      s18: ['18px', '30px'],
      s20: ['20px', '36px'],
      s22: ['22px'],
      title: ['28px'],
      logo: ['80px', '144px'],
    },
    colors: {
      transparent: 'transparent',
      titleActive: '#14142B',
      body: '#4E4B66',
      label: '#6E7191',
      placeholder: '#A0A3BD',
      line: '#D9DBE9',
      inputBackground: '#EFF0F6',
      background: '#F7F7FC;',
      offWhite: {
        DEFAULT: '#FEFEFE',
        dark: '#12121208',
      },
      indigo: '#1D1D50',
      primary: {
        DEFAULT: '#FFA52D',
        dark: '#FF832D',
        light: '#FFD89E',
      },
      secondary: {
        DEFAULT: '#4CAB22',
        dark: '#166C12',
        light: '#8BE264',
      },
      success: {
        DEFAULT: '#34C759',
        dark: '#00A028',
        light: '#DDFFE6',
      },
      error: {
        DEFAULT: '#FF4343',
        dark: '#C60B00',
        light: '#FFD1CF',
      },
    },
    fontFamily: {
      mont: ['Montserrat', 'sans-serif'],
      sans: ['Noto Sans KR', 'sans-serif'],
      ipSans: ['IBM Plex Sans KR', 'sans-serif'],
    },
  },
  plugins: [],
};
