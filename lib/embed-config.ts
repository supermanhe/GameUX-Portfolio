export const EMBED_IFRAME_ALLOW = [
  'accelerometer',
  'ambient-light-sensor',
  'autoplay',
  'camera',
  'clipboard-read',
  'clipboard-write',
  'encrypted-media',
  'fullscreen',
  'gamepad',
  'geolocation',
  'gyroscope',
  'magnetometer',
  'microphone',
  'midi',
  'xr-spatial-tracking',
].join('; ')

export const EMBED_IFRAME_SANDBOX = [
  'allow-same-origin',
  'allow-scripts',
  'allow-forms',
  'allow-pointer-lock',
  'allow-downloads',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation',
  'allow-top-navigation-by-user-activation',
].join(' ')
