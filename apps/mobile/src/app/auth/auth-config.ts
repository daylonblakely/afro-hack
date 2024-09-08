export const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  redirectUrl: 'com.yourapp:/oauth2redirect/google',
  scopes: ['openid', 'profile', 'email'],
};

export const facebookConfig = {
  issuer: 'https://www.facebook.com',
  clientId: 'YOUR_FACEBOOK_CLIENT_ID',
  redirectUrl: 'com.afro-hack:/oauth2redirect/facebook',
  scopes: ['public_profile', 'email'],
};
