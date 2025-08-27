'use client';

import { useEffect, useState } from "react";
import { checkEmail, checkUsername, signUp } from "../actions/auth";
import { FieldErrors, SubmitHandler, useForm, UseFormGetValues, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { passwordErrorsArray, signUpFormSchema, SignUpFormSchema } from "../lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "../lib/debounce";
import { CheckString } from "@rebottal/interfaces";

export default function SignUpForm() {
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors, isSubmitting, touchedFields},
    trigger,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    criteriaMode: 'all',
    mode: 'onChange'
  });

  const submitSignUp: SubmitHandler<SignUpFormSchema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((field) => {
      formData.append(field, data[field as keyof typeof data])
    });
    await signUp(formData);
  }
  
  return (
    <form 
      className="flex flex-col"
      onSubmit={handleSubmit(submitSignUp)}
    >
      <DebounceInput 
        type="text"
        placeholder="Enter Username"
        field="username"
        fieldLabel="Enter Username"
        register={register}
        getValues={getValues}
        checkFunction={checkUsername}
        errors={errors}
        touchedFields={touchedFields}
      />
      <DebounceInput 
        type="text"
        placeholder="Enter Email"
        field="email"
        fieldLabel="Enter Email"
        register={register}
        getValues={getValues}
        checkFunction={checkEmail}
        errors={errors}
        touchedFields={touchedFields}
      />
      <PasswordInput 
        register={register}
        trigger={trigger}
        errors={errors}
      />
      <button type="submit">{!isSubmitting ? 'Sign Up' : 'Processing'}</button>
      <input type="submit" hidden />
    </form>
  );
}

function DebounceInput({
  type,
  placeholder,
  field,
  fieldLabel,
  register, 
  getValues,
  checkFunction,
  errors,
  touchedFields,
}: {
  type: string,
  placeholder: string,
  field: keyof SignUpFormSchema,
  fieldLabel: string,
  register: UseFormRegister<SignUpFormSchema>,
  getValues: UseFormGetValues<SignUpFormSchema>,
  checkFunction: (stringValue: CheckString) => Promise<any>,
  errors: FieldErrors<SignUpFormSchema>,
  touchedFields: Partial<Readonly<any>>
}) {

  const [valueExists, setValueExists] = useState<ValueExists>(1);

  const checkValueDebounce = async (value: string) => {
    setValueExists(n => 2);
    if (await checkFunction({stringValue: value})) setValueExists(n => 1);
    else setValueExists(n => 0);
  }
  const valueDebounce = debounce(checkValueDebounce, 1000);

  const existSwitch = (valueExists: ValueExists) => {
    switch (valueExists) {
      case 0:
        return 'This ' + field + ' is available.';
      
      case 1:
        return 'This ' + field + ' is not available.';

      case 2:
        return 'Checking ' + field + ' availability.';
    }
  }

  return (
    <>
      <label htmlFor={field}>{fieldLabel}</label>
      <input
        type={type}
        {...register(field, {
          onChange: () => {
            if ([0, 1].includes(valueExists) ) {
              valueDebounce(getValues(field));
            }
          }
        })}
        placeholder={placeholder}
        autoComplete="off"
      />
      <p className="text-red-500">{errors[field] && errors[field].message}</p>
      <p>{touchedFields[field] && existSwitch(valueExists)}</p>
    </>
  );
}

function PasswordInput({
  register,
  trigger,
  errors,
}: {
  register: UseFormRegister<SignUpFormSchema>,
  trigger: UseFormTrigger<SignUpFormSchema>,
  errors: FieldErrors<SignUpFormSchema>,
}) {

  const [errorArray, setErrorArray] = useState<string[]>(passwordErrorsArray);

  useEffect(() => {
    trigger('password');
  }, []);

  useEffect(() => {
    setErrorArray(errors.password?.types ? passwordErrorsArray.filter((element) => Object.values(errors.password?.types!).flat().includes(element)) : []);
  }, [errors.password?.types])

  return (
    <>
      <label htmlFor="password">Enter Password</label>
      <input 
        type="password" 
        {...register('password', {
          onChange: () => {
            trigger('confirm');
          }
        })}
        placeholder="Enter Password"
        autoComplete="off"
      />
      <div>
        <p>Password must:</p>
        <ul>
          {passwordErrorsArray.map((error) => (
            <li key={error} className={errorArray.includes(error) ? 'text-red-500' : 'text-green-500'}>{error}</li>
          ))}
        </ul>
      </div>
      <FieldInput 
        type="password"
        placeholder="Re-enter Password"
        field="confirm"
        fieldLabel="Confirm Password"
        register={register}
        errors={errors}
      />
    </>
  );
}

function FieldInput({
  type,
  placeholder,
  field,
  fieldLabel,
  register,
  errors
}: {
  type: string,
  placeholder: string,
  field: keyof SignUpFormSchema,
  fieldLabel: string,
  register: UseFormRegister<SignUpFormSchema>,
  errors: FieldErrors<SignUpFormSchema>,
}) {
 
  return (
    <>
      <label htmlFor={field}>{fieldLabel}</label>
      <input 
        type={type} 
        {...register(field)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <p className="text-red-500">{errors[field] && errors[field].message}</p>
    </>
  );
}

type ValueExists = 0 | 1 | 2;