import { TextField } from '@material-ui/core';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from 'react';
import { Controller } from 'react-hook-form';

function DateTimeField(props) {
    const { form, name, label, disabled, placeholder } = props;
    const { formState } = form;

    const hasError = !!formState.errors[name];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
                name={name}
                control={form.control}
                // disabled={disabled}
                render={({ field }) => (
                    <DateTimePicker
                        {...field}
                        // disableFuture
                        label={label}
                        renderInput={(props) => <TextField {...props} />}
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DateTimeField;
