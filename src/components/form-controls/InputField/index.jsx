import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    label: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
};

function InputField(props) {
    const { form, name, label, disabled, placeholder, defaultValues } = props;
    const { formState } = form;

    // set default values
    if (defaultValues) {
        form.setValue(name, defaultValues);
    }

    const hasError = !!formState.errors[name];

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <TextField
                    {...field}
                    disabled={disabled}
                    fullWidth
                    label={label}
                    margin="normal"
                    variant="outlined"
                    error={hasError}
                    helperText={formState.errors[name]?.message}
                    placeholder={placeholder}
                />
            )}
        />
    );
}

export default InputField;
