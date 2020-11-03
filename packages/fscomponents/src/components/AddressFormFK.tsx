// tslint:disable:cyclomatic-complexity
import React, { FC, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import {
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import FormPicker from './FormikFields/Picker';
import FormTextInput from './FormikFields/FormTextInput';
import { defineSchema, regexSchemaPresets } from '../lib/formikHelpers';
import { states } from '../lib/states';
import FSi18n, { translationKeys } from '@brandingbrand/fsi18n';
import { TooltipDisplay } from './TooltipDisplay';
import ToggleButton from './ToggleButton';
import { palette } from '../styles/variables';

const styles = StyleSheet.create({
  iconWrapperStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: palette.secondary,
    position: 'absolute',
    right: 15,
    top: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background
  },
  iconStyles: {
    width: 7,
    height: 12
  },
  aptStyles: {
    letterSpacing: 0.5,
    fontSize: 13,
    color: palette.secondary,
    marginBottom: 45
  },
  tooltipContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    width: 240,
    top: -63,
    right: 9
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.5
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.5,
    color: palette.secondary
  }
});

interface AddressFormProps {
  enableToggle?: boolean;
  initialValues?: CommerceTypes.Address;
  ref?: React.RefObject<FormikProps<AddressFormInput>>;
}

export interface AddressFormInput {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string | null;
  zip: string;
  phoneNumber: string;
  apt: string;
}

const generateFormSchema = () => defineSchema<AddressFormInput>({
  firstName: yup.string().required(
    `${FSi18n.string(
      translationKeys.flagship.addressForm.firstName
    )} ${FSi18n.string(
      translationKeys.flagship.errors.required
    )}`
  ),
  lastName: yup.string().required(
    `${FSi18n.string(
      translationKeys.flagship.addressForm.lastName
    )} ${FSi18n.string(
      translationKeys.flagship.errors.required
    )}`
  ),
  street: yup.string().required(
    `${FSi18n.string(
      translationKeys.flagship.addressForm.street
    )} ${FSi18n.string(
      translationKeys.flagship.errors.required
    )}`
  ),
  city: yup.string().required(
    `${FSi18n.string(
      translationKeys.flagship.addressForm.city
    )} ${FSi18n.string(
      translationKeys.flagship.errors.required
    )}`
  ),
  state: yup.string().required(
    `${FSi18n.string(
      translationKeys.flagship.addressForm.state
    )} ${FSi18n.string(
      translationKeys.flagship.errors.required
    )}`
  ).nullable(),
  zip: yup.string(),
  apt: yup.string(),
  phoneNumber: regexSchemaPresets().phone2
});

const formKeys = {
  phoneNumber: 'phoneNumber',
  firstName: 'firstName',
  lastName: 'lastName',
  street: 'street',
  apt: 'apt',
  city: 'city',
  state: 'state',
  zip: 'zip'
};

enum FormInputsTypes {
  picker,
  input,
  accordion
}

interface FormFieldsItem {
  title: string;
  formField: string;
  type:
    FormInputsTypes.input |
    FormInputsTypes.picker |
    FormInputsTypes.accordion;
  keyboardType?: KeyboardTypeOptions;
}

type FormFieldsType = FormFieldsItem[];

const formFields: FormFieldsType = [
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.firstName),
    formField: formKeys.firstName,
    type: FormInputsTypes.input
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.lastName),
    formField: formKeys.lastName,
    type: FormInputsTypes.input
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.street),
    formField: formKeys.street,
    type: FormInputsTypes.input
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.apt),
    formField: formKeys.apt,
    type: FormInputsTypes.accordion
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.city),
    formField: formKeys.city,
    type: FormInputsTypes.input
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.state),
    formField: formKeys.state,
    type: FormInputsTypes.picker
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.postal),
    formField: formKeys.zip,
    keyboardType: 'numeric',
    type: FormInputsTypes.input
  },
  {
    title: FSi18n.string(translationKeys.flagship.addressForm.phoneNumber),
    formField: formKeys.phoneNumber,
    keyboardType: 'phone-pad',
    type: FormInputsTypes.input
  }
];

const stateArray = Object
  .entries(states)
  .map(([stateCode, stateName]) => ({
    label: stateName,
    value: stateCode
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const icons = {
  error: require('../../../assets/icons/Error.png')
};

const AddressForm = React.forwardRef<FC<AddressFormProps>, AddressFormProps>((
  {
  enableToggle,
  initialValues
  },
  ref
) => {
  const [isAptVisible, setAptVisible] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [hiddenPhoneNumber, setHiddenPhoneNumber] = useState<string>('');
  const [tooltipTimer, setTooltipTimer] = useState<any>();
  const handleSubmit = (values: AddressFormInput) => {
    // TODO: add event handler onSubmit
  };

  const addressFormInitialValues: AddressFormInput = {
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    street: initialValues?.address1 || '',
    city: initialValues?.city || '',
    state: initialValues?.stateCode || '',
    zip: initialValues?.postalCode || '',
    phoneNumber: initialValues?.phone || '',
    apt: ''
  };

  const showAptInput = () => {
    setAptVisible(true);
  };

  const formikConfig = {
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: addressFormInitialValues,
    validationSchema: generateFormSchema(),
    onSubmit: handleSubmit
  };

  const toogleTooltip = () => {
    setShowTooltip(!showTooltip);
    if (!showTooltip) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(setTimeout(() => {
        setShowTooltip(false);
      }, 4000));
    }
  };

  const onChangePhoneNumber = (
    fieldName: string
  ) => (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (fieldName === formKeys.phoneNumber) {
      setPhoneNumber(e.nativeEvent.text);
    }
  };

  const hideChangePhoneNumber = (
    setFormikValue: (fieldName: string, value: string) => void,
    fieldName: string
  ) => () => {
    if (fieldName === formKeys.phoneNumber) {
      setHiddenPhoneNumber(phoneNumber);
      setFormikValue(fieldName, phoneNumber);

      const visibleValue = phoneNumber.substr(phoneNumber.length - 4);
      const hiddenValue = phoneNumber.substr(0, phoneNumber.length - 4);
      setPhoneNumber(hiddenValue.replace(/[0-9]/g, 'X') + visibleValue);
    }
  };

  const showChangePhoneNumber = (fieldName: string) => () => {
    if (fieldName === formKeys.phoneNumber) {
      setPhoneNumber(hiddenPhoneNumber);
    }
  };

  return (
    <Formik {...formikConfig} innerRef={ref as any}>
      {
        props => {
          const {setFieldValue, errors} = props;

          return (
            <KeyboardAvoidingView
              enabled
              keyboardVerticalOffset={100}
            >
              <ScrollView>
                {!!formFields && formFields.map((elem, i: number) => {
                  const currentError = errors[elem.formField as keyof AddressFormInput];
                  const isPhoneNumber = elem.formField === formKeys.phoneNumber;
                  const phoneNumberMask = '[___]-[___]-[____]';

                  switch (elem.type) {
                    case FormInputsTypes.input:
                      return (
                        <View>
                          <FormTextInput
                            key={i}
                            // errorsMessage={currentError || ''}
                            title={elem.title}
                            required
                            formFieldName={elem.formField}
                            errorIcon={icons.error}
                            setFormikField={setFieldValue}
                            keyboardType={elem.keyboardType}
                            onBlur={hideChangePhoneNumber(setFieldValue, elem.formField)}
                            onFocus={showChangePhoneNumber(elem.formField)}
                            onChange={onChangePhoneNumber(elem.formField)}
                            // iconUrl={isPhoneNumber && assetsImages.help}
                            imageWrapperStyle={isPhoneNumber && styles.iconWrapperStyle}
                            imageStyles={isPhoneNumber && styles.iconStyles}
                            iconPress={toogleTooltip}
                            value={phoneNumber}
                            defaultValue={
                              props.values[elem.formField as keyof AddressFormInput] || ''
                            }
                            mask={isPhoneNumber && phoneNumberMask as any}
                          />
                          {
                            isPhoneNumber && (
                              <TooltipDisplay
                                show={showTooltip}
                                positionX={'right'}
                                positionY={'bottom'}
                                style={styles.tooltipContainer}
                              >
                                <Text
                                  style={styles.tooltipText}
                                >
                                  {FSi18n.string(translationKeys.flagship.addressForm.tooltip)}
                                </Text>
                              </TooltipDisplay>
                            )
                          }
                        </View>
                      );
                    case FormInputsTypes.picker:
                      return (
                        <FormPicker
                          key={i}
                          required
                          items={stateArray}
                          title={elem.title}
                          errorsMessage={currentError || ''}
                          setFormikField={setFieldValue}
                          formFieldName={elem.formField}
                        />
                      );
                    case FormInputsTypes.accordion:
                      return isAptVisible ? (
                        <FormTextInput
                          key={i}
                          setFormikField={setFieldValue}
                          title={elem.title}
                          formFieldName={elem.formField}
                          errorsMessage={currentError || ''}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={showAptInput}
                        >
                          <Text
                            style={styles.aptStyles}
                          >
                            + {FSi18n.string(translationKeys.flagship.addressForm.apt)}
                          </Text>
                        </TouchableOpacity>
                      );
                    default:
                      return null;
                  }
                })}
                {enableToggle && (
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>
                      {FSi18n.string(translationKeys.flagship.addressForm.useAsDefaultAddress)}
                    </Text>
                    <ToggleButton />
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          );
        }
      }
    </Formik>
  );
});

export default AddressForm;
