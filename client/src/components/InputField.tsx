import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  textarea,
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  const TextareaOrInput: any = (textarea) ? Textarea : Input
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <TextareaOrInput {...props} {...field} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
