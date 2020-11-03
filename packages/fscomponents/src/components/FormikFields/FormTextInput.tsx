import React, { FC, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { palette } from '../../styles/variables';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginBottom: 30
  },
  title: {
    color: palette.background,
    letterSpacing: 0.5,
    fontSize: 13,
    lineHeight: 13,
    marginBottom: 3
  },
  titleError: {
    color: palette.error
  },
  textInput: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: 0.5,
    color: palette.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.secondary,
    backgroundColor: palette.background,
    paddingLeft: 20,
    paddingRight: 40
  },
  textInputError: {
    borderWidth: 2,
    borderColor: palette.error
  },
  placeholder: {
    position: 'absolute',
    top: 31,
    left: 20,
    fontWeight: '500',
    fontSize: 17,
    letterSpacing: 0.5,
    color: palette.background
  },
  activeInput: {
    borderWidth: 2
  },
  errorMessage: {
    marginTop: 1,
    color: palette.error
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7
  },
  errorIconStyle: {
    marginRight: 5
  }
});

interface FormTextInputType extends TextInputProps {
  formFieldName: string;
  errorsMessage?: string;
  required?: boolean;
  requiredSymbol?: string;
  title?: string;
  innerButtonText?: string;
  placeholder?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  setFormikField?: (field: string, value: any, shouldValidate?: boolean) => void;
  iconPress?: (value: any) => void;
  iconUrl?: ImageSourcePropType;
  errorIcon?: ImageSourcePropType;
  containerStyles?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  titleErrorStyles?: StyleProp<TextStyle>;
  errorMessageStyle?: StyleProp<TextStyle>;
  placeholderStyles?: StyleProp<TextStyle>;
  textInputStyles?: StyleProp<ViewStyle>;
  textInputErrorStyles?: StyleProp<ViewStyle>;
  activeInputStyles?: StyleProp<ViewStyle>;
  imageWrapperStyle?: StyleProp<ViewStyle>;
  imageStyles?: StyleProp<ImageStyle>;
  innerButtonTextStyle?: StyleProp<TextStyle>;
  errorContainer?: StyleProp<ViewStyle>;
  errorIconStyle?: StyleProp<ImageStyle>;
  innerButton?: boolean;
  innerButtonWrapperStyle?: StyleProp<ViewStyle>;
  innerButtonPress?: (value: string) => void;
  mask?: string;
  submitForm?: () => Promise<void>;
}

const icons = {
  warning: require('../../../assets/warning.png')
};

// tslint:disable:cyclomatic-complexity
const FormTextInput: FC<FormTextInputType> = props => {
  const {
    title,
    containerStyles,
    titleStyles,
    titleErrorStyles,
    iconUrl,
    placeholder,
    placeholderStyles,
    textInputStyles,
    textInputErrorStyles,
    required,
    requiredSymbol,
    imageStyles,
    onBlur,
    setFormikField,
    onFocus,
    activeInputStyles,
    imageWrapperStyle,
    iconPress,
    formFieldName,
    keyboardType,
    errorsMessage,
    errorMessageStyle,
    maxLength,
    innerButton,
    errorIcon,
    errorContainer,
    errorIconStyle,
    innerButtonPress,
    innerButtonWrapperStyle,
    innerButtonText,
    innerButtonTextStyle
  } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const TEXT_VARIABLES = {
    expDate: 'expDate',
    cardNumber: 'cardNumber',
    default: 'default'
  };

  const handleChange = (text: string): void => {
    setInputValue(text);
    setFormikField?.(formFieldName, text);
  };

  const handlePressInnerButton = async () => {
    if (!!innerButtonPress) {
      innerButtonPress(inputValue);
    }
    if (!!props.submitForm) {
      props.submitForm().catch(e => {
        console.log('Error submit form', e);
      });
    }
  };

  const handleFocus = () => {
    setActiveInput(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setActiveInput(false);
    onBlur?.();
  };

  const isValueEmpty = inputValue.length === 0;
  const keyboardTypeValue = keyboardType || TEXT_VARIABLES.default as any;

  return (
    <View
      style={[
        styles.container,
        containerStyles
      ]}
    >
      {!!title && !!title.length && (
      <Text
        style={[
          styles.title,
          titleStyles,
          !!errorsMessage && styles.titleError,
          !!errorsMessage && titleErrorStyles
        ]}
      >
        {
          required ?
            requiredSymbol || '*' + title :
            title
        }
      </Text>
      )}
      <TextInput
        style={[
          styles.textInput,
          activeInput && styles.activeInput,
          activeInputStyles,
          textInputStyles,
          !!errorsMessage && styles.textInputError,
          !!errorsMessage && textInputErrorStyles
        ]}
        keyboardType={keyboardTypeValue}
        onBlur={handleBlur}
        onChangeText={handleChange}
        onFocus={handleFocus}
        value={inputValue}
        maxLength={maxLength}
        {...props}
      />
      {isValueEmpty && (
        <Text
          style={[
            styles.placeholder,
            placeholderStyles
          ]}
        >
          {placeholder}
        </Text>
      )}
      {!!iconUrl && (
        <TouchableOpacity
          style={[imageWrapperStyle]}
          onPress={iconPress}
        >
          <Image
            source={iconUrl}
            style={[imageStyles]}
          />
        </TouchableOpacity>
      )}
      {!!innerButton && (
        <TouchableOpacity
          style={innerButtonWrapperStyle}
          onPress={handlePressInnerButton}
          disabled={!!errorsMessage}
        >
          <Text style={innerButtonTextStyle}>
            {innerButtonText}
          </Text>
        </TouchableOpacity>
      )}
      {!!errorsMessage && (
        <View
          style={[
            styles.errorContainer,
            errorContainer
          ]}
        >
          <Image
            source={errorIcon || icons.warning}
            style={[
              styles.errorIconStyle,
              errorIconStyle
            ]}
          />
          <Text
            style={[
              styles.errorMessage,
              errorMessageStyle
            ]}
          >
            {errorsMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FormTextInput;
