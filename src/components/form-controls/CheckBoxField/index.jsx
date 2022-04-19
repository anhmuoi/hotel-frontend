import { Checkbox, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

CheckBoxField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disabled: PropTypes.bool,
};

function CheckBoxField(props) {
  const { form, name, label, disabled } = props;


  return (
    <Controller
      name={name}
      control={form.control}
      disabled={disabled}
      render={({ field }) => (
        <Checkbox
          {...field}
          aria-label={label}
        />
      )}
    />
  );
}

export default CheckBoxField;
