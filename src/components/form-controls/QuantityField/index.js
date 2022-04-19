import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

QuantityField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
};
const useStyles = makeStyles((theme) => ({
  margin: {
    width: "100%",
    left: "0",
    right: "0",
    top: theme.spacing(2),
    "margin-bottom": theme.spacing(2.625),
  },
}));

function QuantityField(props) {
  const { form, name, label } = props;
  const { formState, setValue } = form;

  const hasError = !!formState.errors[name];

  const classes = useStyles();

  return (
    <Controller
      name={name}
      control={form.control}
      
      render={({ field }) => (
        <FormControl
          error={hasError}
          {...field}
          className={clsx(classes.margin)}
          variant="outlined"
          size="small"
        >
          <Box>
            <Typography>Quantity</Typography>
            <IconButton
              onClick={() => setValue(name, Number.parseInt(field.value) - 2)}
            >
              <RemoveCircleOutline></RemoveCircleOutline>
            </IconButton>
            <OutlinedInput
              value={field.value}
              id={name}
              name={name}
              margin="none"
              type="number"
              error={hasError}
            />
            <IconButton
              onClick={() => setValue(name, Number.parseInt(field.value) + 1)}
            >
              <AddCircleOutline></AddCircleOutline>
            </IconButton>
          </Box>
          <FormHelperText id="my-helper-text">
            {formState.errors[name]?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default QuantityField;
