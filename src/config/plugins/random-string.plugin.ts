export const randomString = {

  generateRandomNumberString: ( quantityOfDigits: number ): string => {

    if ( quantityOfDigits <= 0 ) {
      throw Error('Invalid quantity of digits');
    }

    let finalString = '';

    for ( let i = 1; i <= quantityOfDigits; i++ ) {
      finalString += Math.floor( Math.random() * 10 );
    }

    return finalString;
  },

  generateRandomString: ( quantityCharacters = 4 ) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    const charactersLength = characters.length;

    for ( let i = 0; i < quantityCharacters; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

} 