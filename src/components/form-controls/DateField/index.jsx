import { TextField } from '@material-ui/core';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from 'react';
import { Controller } from 'react-hook-form';

function DateField(props) {
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
                    // <TextField
                    //   {...field}
                    //   fullWidth
                    //   label={label}
                    //   margin="normal"
                    //   variant="outlined"
                    //   error={hasError}
                    //   helperText={formState.errors[name]?.message}
                    //   placeholder={placeholder}
                    // />
                    <DatePicker
                        {...field}
                        // disableFuture
                        label={label}
                        openTo="year"
                        views={['year', 'month', 'day']}
                
                        // toolbarFormat='yyyy-MM-dd'
                        renderInput={(params) => <TextField {...params} />}
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DateField;
