import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor() { }

  minValidLength = 6
  maxValidLength = 18
  usualValidChars = /^\d+$/

  formats = {
    'ean8'   : { validChars : /^\d+$/, validLength : 8 },
    'ean12'  : { validChars : /^\d+$/, validLength : 12 },
    'ean13'  : { validChars : /^\d+$/, validLength : 13 },
    'ean14'  : { validChars : /^\d+$/, validLength : 14 },
    'ean18'  : { validChars : /^\d+$/, validLength : 18 },
    'gtin12' : { validChars : /^\d+$/, validLength : 12 },
    'gtin13' : { validChars : /^\d+$/, validLength : 13 },
    'gtin14' : { validChars : /^\d+$/, validLength : 14 }
  };

  validateGtin(value) {
    let barcode = value.substring( 0, value.length - 1 );
    let checksum = parseInt( value.substring( value.length - 1 ), 10 );
    let calcSum = 0;
    let calcChecksum = 0;

    barcode.split('').map(function( number, index ) {
      number = parseInt( number, 10 );
      if ( value.length % 2 === 0 ) {
        index += 1;
      }
      if ( index % 2 === 0 ) {
        calcSum += number;
      }
      else {
        calcSum += number * 3;
      }
    });

    calcSum %= 10;
    calcChecksum = (calcSum === 0) ? 0 : (10 - calcSum);

    if ( calcChecksum !== checksum ) {
      return false;
    }

    return true;
  }

  validate(format, options, barcode){

    if ( format && !this.formats[format] ) throw new Error( '"format" invalid' );

    format = (format) ? this.formats[format] : 'autoSelect';
    options = (options) ? options : { enableZeroPadding : true };

    if ( !options.enableZeroPadding ) {
      options.enableZeroPadding = true;
    }

    if ( format === 'autoSelect' ) {

      if ( barcode.length < this.minValidLength || barcode.length > this.maxValidLength ) {
        return false;
      }

      var isValidGtin = this.validateGtin( barcode );
      var paddedBarcode = barcode;
      var successfullyPadded = false;

      if ( !isValidGtin ) {
        var possiblyMissingZeros = this.maxValidLength - barcode.length;
        while( possiblyMissingZeros-- ) {
          paddedBarcode = '0' + paddedBarcode;
          if ( this.validateGtin( paddedBarcode ) ) {
            isValidGtin = true;
            successfullyPadded = true;
            break;
          }
        }
      }

      return {
        possibleType: (barcode.length > 8) ? 'GTIN' + barcode.length : 'EAN8 / padded GTIN',
        isValid: isValidGtin
      };

    }

    var validChars = format.validChars;
    var validLength = format.validLength;
    var enableZeroPadding = options.enableZeroPadding;

    if ( validChars.exec( barcode ) === null ) {
      return false;
    }

    if ( enableZeroPadding && barcode.length < validLength ) {
      var missingZeros = validLength - barcode.length;
      while( missingZeros-- ) {
        barcode = '0' + barcode;
      }
    }
    else if ( !enableZeroPadding && barcode.length != validLength ) {
      return false;
    }
    else if ( barcode.length > validLength ) {
      return false;
    }

    return this.validateGtin( barcode );
  }
  
}
