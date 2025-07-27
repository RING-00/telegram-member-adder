import localFont from 'next/font/local';

export const clashDisplayExtralight = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Extralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Extralight.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Extralight.ttf',
      weight: '200',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-extralight',
});

export const clashDisplayLight = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Light.ttf',
      weight: '300',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-light',
});

export const clashDisplayRegular = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-regular',
});

export const clashDisplayMedium = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-medium',
});

export const clashDisplaySemibold = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Semibold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Semibold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-semibold',
});

export const clashDisplayBold = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash-bold',
});

export const clashDisplayVariable = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashDisplay-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Variable.woff',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ClashDisplay-Variable.ttf',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-clash',
});

export function getClashDisplayVariables() {
  return `${clashDisplayVariable.variable} ${clashDisplayExtralight.variable} ${clashDisplayLight.variable} ${clashDisplayRegular.variable} ${clashDisplayMedium.variable} ${clashDisplaySemibold.variable} ${clashDisplayBold.variable}`;
}
