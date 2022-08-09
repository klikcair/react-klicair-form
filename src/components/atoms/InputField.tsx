import React, { useState, useEffect, InputHTMLAttributes } from 'react';
import '../../styles/components/atoms/_input_field.scss';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
  width?: 'fixed' | 'fluid';
  _prefix?: string,
  suffix?: string,
  _size?: 'small' | 'medium' | 'large';
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  isError?: boolean;
}

export default function InputField({
  placeholder,
  type,
  width,
  _prefix,
  suffix,
  _size,
  title,
  subtitle,
  disabled,
  isError,
  ...nativeProps
}: InputFieldProps) {
  const [seePassword, setSeePassword] = useState(false);
  const [types, setTypes] = useState(type);
  const textFieldSize = `kc-textfield--field--${_size}`;
  const textFieldDisable = disabled ? ' kc-textfield--disabled' : ' ';
  const textFieldError = !disabled && isError ? ' kc-textfield--error' : ' ';
  const textFieldWidth = `kc-textfield--${width}`;

  const showTogglePassword = () => (
    !seePassword ? (
      <button
        className="kc-textfield--toggle-password"
        type="button"
        disabled={disabled}
        onClick={() => setSeePassword(!seePassword)}
      >
        <i className="fa fa-eye" />
      </button>
    ) : (
      <button
        className="kc-textfield--toggle-password"
        type="button"
        disabled={disabled}
        onClick={() => setSeePassword(!seePassword)}
      >
        <i className="fa fa-eye-slash" />
      </button>
    )
  );

  const showSuffix = () => (
    suffix ? <div className="kc-textfield--suffix"><span className="kc-body2">{suffix}</span></div> : null
  );

  useEffect(() => {
    if (type === 'password') {
      setTypes(seePassword ? 'text' : 'password');
    }
  }, [seePassword, type]);

  return (
    <div className={`kc-textfield ${textFieldWidth}${textFieldDisable}${textFieldError}`}>
      {
        title ? (
          <div className="kc-textfield--title">
            <span className="kc-caption">{title}</span>
          </div>
        ) : null
      }
      <div className={`kc-textfield--field ${textFieldSize}`}>
        {_prefix ? <div className="kc-textfield--prefix"><span className="kc-body2">{_prefix}</span></div> : null}
        <input
          placeholder={placeholder}
          disabled={disabled}
          type={types}
          {...nativeProps}
        />
        {type === 'password' ? showTogglePassword() : showSuffix()}
      </div>
      {
        subtitle ? (
          <div className="kc-textfield--subtitle">
            <span className="kc-overline">{subtitle}</span>
          </div>
        ) : null
      }
    </div>
  );
}

InputField.defaultProps = {
  width: 'fixed',
  _prefix: '',
  suffix: '',
  _size: 'medium',
  title: '',
  subtitle: '',
  disabled: false,
  isError: false,
};
