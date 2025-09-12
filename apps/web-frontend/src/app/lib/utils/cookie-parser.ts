import { CookieAttributes } from "@rebottal/app-definitions";

export function parseCookie(cookieString: string) {

  const parsedCookie: CookieAttributes = {
    name: '',
    value: ''
  };

  const cookieData = cookieString.split('; ');

  const cookieNameAndValue = cookieData[0].split('=');
  parsedCookie.name = cookieNameAndValue[0];
  parsedCookie.value = cookieNameAndValue[1];

  for (let i = 1; i < cookieData.length; i++) {
    const attributeNameAndValue = cookieData[i].split('=');

    switch (attributeNameAndValue[0]) {
      case 'Domain':
        parsedCookie.domain = attributeNameAndValue[1];
        break;

      case 'Expires':
        parsedCookie.expires = Date.parse(attributeNameAndValue[1]);
        break;

      case 'HttpOnly':
        parsedCookie.httpOnly = true;
        break;

      case 'MaxAge':
        parsedCookie.maxAge = parseInt(attributeNameAndValue[1]);
        break;

      case 'Partitioned':
        parsedCookie.partitioned = true;
        break;

      case 'Path':
        parsedCookie.path = attributeNameAndValue[1];
        break;

      case 'SameSite':
        parsedCookie.sameSite = attributeNameAndValue[1];
        break;

      case 'Secure':
        parsedCookie.secure = true;
        break; 
    }
  }

  return parsedCookie;
}