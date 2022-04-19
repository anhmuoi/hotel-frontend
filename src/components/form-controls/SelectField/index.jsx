import { MenuItem, Select, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

SelectField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    label: PropTypes.string,
    disabled: PropTypes.bool,
};

function SelectField(props) {
    const { form, name, label, disabled, selectList, defaultValue } = props;
    const { formState } = form;
    // console.log(defaultValue);


    const hasError = !!formState.errors[name];

    return (
        <Controller
            name={name}
            control={form.control}
            disabled={disabled}
            render={({ field }) => (
                <Select {...field} fullWidth label={label} variant="outlined"  error={hasError}>
                    {selectList.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            )}
        />
    );
}

export default SelectField;
