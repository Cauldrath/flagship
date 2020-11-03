import * as yup from 'yup';
import ccValidator from 'card-validator';

export function defineSchema<T extends object>(fields: yup.ObjectSchemaDefinition<Partial<T>>):
  yup.ObjectSchema<Partial<T>> {
  return yup.object().shape(fields);
}

const errorMessages = {
  required: 'This field is required',
  cc: 'Please enter a valid credit card.',
  expDate: 'Please enter a valid expiration date',
  cvv: 'Can contain only numbers'
};

export const regexSchemaPresets = (overrides: Record<string, string> = {}) => {
  return {
    phone: yup.string().matches(
      /^[+]?[0-9]{1}[0-9 ]{3,20}$/, overrides.phone || 'Please enter a valid phone number'),
    phone2: yup.string().matches(
      // tslint:disable-next-line:ter-max-len
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*) *?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      overrides.phone2 || 'Please enter a valid phone number'
    ),
    email: yup.string().matches(
      // tslint:disable-next-line:ter-max-len
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
      overrides.email || 'Invalid Email'
    ),
    expDate: yup.string().required('This field is required').matches(
      /^((0[1-9])|(1[0-2]))\/(\d{2})$/, overrides.expDate || errorMessages.expDate),
    cvv: yup.string().required(errorMessages.required).matches(
      /^[0-9]+$/, overrides.cvv || errorMessages.cvv),
    creditCardNumber: (unmaskedCard: string) => yup.string().required('This field is required')
      .test('cardNumber', overrides.creditCardNumber || errorMessages.cc, value => {
        const updatedValue: string = value.replace(/-/g, '');
        const validCreditCardTypes = ['american-express', 'discover', 'mastercard', 'visa'];
        const isMaskedCC = updatedValue.includes('*');
        const ccNumber = isMaskedCC ? unmaskedCard.replace(/\s/g, '') :
          updatedValue.replace(/\s/g, '');
        const creditCard = ccValidator.number(ccNumber);
        const ccType = creditCard.card?.type;
        return !!ccType && validCreditCardTypes.includes(ccType);
      })
  };
};

export const schemaRegex = regexSchemaPresets();

