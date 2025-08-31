'use client';

import { useCallback, useEffect, useState } from "react";
import { signUp } from "../../actions/auth";
import { FieldErrors, SubmitHandler, useForm, UseFormGetValues, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { passwordErrorsArray, signUpFormSchema, SignUpUser, CheckValue } from "../../lib/validation-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounceBoolean } from "../../lib/debounce";

export default function SignUpForm() {
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors, isSubmitting, touchedFields},
    trigger,
  } = useForm<SignUpUser>({
    resolver: zodResolver(signUpFormSchema),
    criteriaMode: 'all',
    mode: 'onChange'
  });

  const submitSignUp: SubmitHandler<SignUpUser> = async (data) => {
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
        trigger={trigger}
        getValues={getValues}
        apiUrl={'check-username'}
        errors={errors}
        touchedFields={touchedFields}
      />
      <DebounceInput 
        type="text"
        placeholder="Enter Email"
        field="email"
        fieldLabel="Enter Email"
        register={register}
        trigger={trigger}
        getValues={getValues}
        apiUrl={'check-email'}
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
  trigger,
  getValues,
  apiUrl,
  errors,
  touchedFields,
}: {
  type: string,
  placeholder: string,
  field: keyof SignUpUser,
  fieldLabel: string,
  register: UseFormRegister<SignUpUser>,
  trigger: UseFormTrigger<SignUpUser>,
  getValues: UseFormGetValues<SignUpUser>,
  apiUrl: string,
  errors: FieldErrors<SignUpUser>,
  touchedFields: Partial<Readonly<any>>
}) {

  const [valueExists, setValueExists] = useState<ValueExists>(1);

  const checkValueDebounce = async (trigger: boolean, value: string) => {

    const checkValue: CheckValue = {value: value}
    const response = await fetch('/api/auth/' + apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(checkValue),
    })
    if (await response.json()) setValueExists(n => 1);
    else setValueExists(n => 0);
  };

  const debounceDelay = 1000;
  const valueDebounce = useCallback(debounceBoolean(checkValueDebounce, debounceDelay), []);

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
          onChange: async () => {
            setValueExists(n => 2);
            const valid = await trigger(field);
            valueDebounce(valid, getValues(field));
          }
        })}
        placeholder={placeholder}
        autoComplete="off"
      />
      <p className="text-red-500">{errors[field] && errors[field].message}</p>
      <p>{(touchedFields[field] && !errors[field]) && existSwitch(valueExists)}</p>
    </>
  );
}

function PasswordInput({
  register,
  trigger,
  errors,
}: {
  register: UseFormRegister<SignUpUser>,
  trigger: UseFormTrigger<SignUpUser>,
  errors: FieldErrors<SignUpUser>,
}) {

  const [errorArray, setErrorArray] = useState<string[]>(passwordErrorsArray);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmVisibility, setConfirmVisibility] = useState<boolean>(false);

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
        type={passwordVisibility ? 'text' : 'password'} 
        {...register('password', {
          onChange: () => {
            trigger('confirm');
          }
        })}
        placeholder="Enter Password"
        autoComplete="off"
      />
      <button type="button" onClick={() => setPasswordVisibility(!passwordVisibility)}>Reveal</button>
      <div>
        <p>Password must:</p>
        <ul>
          {passwordErrorsArray.map((error) => (
            <li key={error} className={errorArray.includes(error) ? 'text-red-500' : 'text-green-500'}>{error}</li>
          ))}
        </ul>
      </div>
      <label htmlFor="confirm">Confirm Password</label>
      <input 
        type={confirmVisibility ? 'text' : 'password'} 
        {...register('confirm')}
        placeholder="Re-enter Password"
        autoComplete="off"
      />
      <button type="button" onClick={() => setConfirmVisibility(!confirmVisibility)}>Reveal</button>
      <p className="text-red-500">{errors.confirm && errors.confirm.message}</p>
    </>
  );
}

type ValueExists = 0 | 1 | 2;