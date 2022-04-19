import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Controller } from "react-hook-form";




PasswordField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disabled: PropTypes.bool,
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

function PasswordField(props) {
  const { form, name, label, disabled } = props;
  const { formState } = form;


  const hasError = !!formState.errors[name];

  const classes = useStyles();
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <Controller
      name={name}
      control={form.control}
      disabled={disabled}
      render={({ field }) => (
        <FormControl
          error={hasError}
          {...field}
          className={clsx(classes.margin)}
          variant="outlined"
        >
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <OutlinedInput
            value={field.value}
            id={name}
            
            name={name}
            fullWidth
            label={label}
            margin="none"
            type={values.showPassword ? "text" : "password"}
            
            onChange={handleChange("password")}
            error={hasError}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="my-helper-text">
            {formState.errors[name]?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default PasswordField;
