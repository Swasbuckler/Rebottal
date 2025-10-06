'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { FieldErrors, SubmitHandler, useForm, UseFormGetValues, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { passwordErrorsArray, signUpFormSchema, SignUpUser, CheckData, CreateUser } from "@rebottal/app-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounceTrigger } from "../../lib/utils/debounce";
import axios from "axios";
import { getRecaptchaToken } from "@/app/lib/auth/recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faEyeSlash, faSpinner, faX } from "@fortawesome/free-solid-svg-icons";

export default function SignUpForm({
  setEmail
}: {
  setEmail: Dispatch<SetStateAction<string>>
}) {
  
  const [existsList, setExistsList] = useState([false, false]);

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

  const setExists = (index: number, exists: boolean) => {
    let newExistsList = [];
    if (index < 0 || index >= existsList.length) {
      newExistsList = existsList;
    } else {
      newExistsList = [...existsList.slice(0, index), exists, ...existsList.slice(index + 1)];
    }

    setExistsList(newExistsList);
  };

  const submitSignUp: SubmitHandler<SignUpUser> = async (data) => {
    if (existsList.some((exists) => exists === true)) {
      return;
    }

    const rawInput: SignUpUser = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm: data.confirm,
    };

    const validatedFields = signUpFormSchema.safeParse(rawInput);
    if (!validatedFields.success) {
      return;
    }

    const signUpData: CreateUser = {
      username: validatedFields.data.username,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    };
    
    const recaptchaToken = await getRecaptchaToken();

    try {
      const response = await axios.post(
        '/api/auth/sign-up', 
        signUpData,
        {
          headers: {
            'x-recaptcha-token': recaptchaToken
          }
        }
      );

      if (response.status === 200) {
        setEmail(signUpData.email);
      }
    } catch (error: any) {
      
    }
  }
  
  return (
    <form 
      className="flex flex-col gap-1"
      onSubmit={handleSubmit(submitSignUp)}
    >
      <DebounceInput 
        type="text"
        field="username"
        fieldLabel="Username"
        register={register}
        trigger={trigger}
        getValues={getValues}
        apiUrl={'/check/username'}
        errors={errors}
        touchedFields={touchedFields}
        existIndex={0}
        setExists={setExists}
      />
      <DebounceInput 
        type="text"
        field="email"
        fieldLabel="Email"
        register={register}
        trigger={trigger}
        getValues={getValues}
        apiUrl={'/check/email'}
        errors={errors}
        touchedFields={touchedFields}
        existIndex={1}
        setExists={setExists}
      />
      <PasswordInput 
        register={register}
        trigger={trigger}
        errors={errors}
      />
      <button 
        className="h-8 p-1 mb-2 text-sm lg:text-base font-bold text-[#171717] bg-cyan-500 hover:bg-cyan-400 rounded-md cursor-pointer transition-all ease-in-out duration-200" 
        type="submit"
      >
        {!isSubmitting ? 'Sign Up' : 'Processing'}
      </button>
      <input type="submit" hidden />
      <p className="text-sm lg:text-base [&>a]:text-cyan-600 [&>a]:dark:text-cyan-500 [&>a]:hover:text-cyan-400 [&>a]:underline [&>a]:transition-all [&>a]:ease-in-out [&>a]:duration-200">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
    </form>
  );
}

function DebounceInput({
  type,
  field,
  fieldLabel,
  register, 
  trigger,
  getValues,
  apiUrl,
  errors,
  touchedFields,
  existIndex,
  setExists,
}: {
  type: string,
  field: keyof SignUpUser,
  fieldLabel: string,
  register: UseFormRegister<SignUpUser>,
  trigger: UseFormTrigger<SignUpUser>,
  getValues: UseFormGetValues<SignUpUser>,
  apiUrl: string,
  errors: FieldErrors<SignUpUser>,
  touchedFields: Partial<Readonly<any>>,
  existIndex: number,
  setExists: (index: number, exists: boolean) => void
}) {

  const [valueExists, setValueExists] = useState<ValueExists>(1);

  const checkDataDebounce = async (trigger: boolean, value: string) => {

    const checkData: CheckData = {value: value}
    const response = await axios.post(
      '/api/user' + apiUrl, 
      checkData
    );

    if (response.data) {
      setValueExists(() => 1);
    } else {
      setValueExists(() => 0);
      setExists(existIndex, false);
    };
  };

  const debounceDelay = 1000;
  const valueDebounce = useCallback(debounceTrigger(checkDataDebounce, debounceDelay), []);

  const existSwitch = (valueExists: ValueExists) => {
    switch (valueExists) {
      case 0:
        return faCheck;
      
      case 1:
        return faX;

      case 2:
        return faSpinner;
    }
  }

  return (
    <>
      <label 
        className="text-sm lg:text-base font-bold after:ml-0.5 after:text-red-500 after:content-['*']"
        htmlFor={field}
      >
        {fieldLabel}
      </label>
      <div className="flex justify-between bg-[#ededed] dark:bg-[#171717] border-1 border-gray-500 rounded-md">
        <input
          className="flex-1 w-full p-1 px-2 text-sm lg:text-base"
          type={type}
          {...register(field, {
            onChange: async () => {
              setValueExists(() => 2);
              setExists(existIndex, true);

              const valid = await trigger(field);
              valueDebounce(valid, getValues(field));
            }
          })}
          autoComplete="off"
        />
        <div className={`flex items-center justify-center px-2 ${(touchedFields[field] && !errors[field]) ? '' : 'hidden'} ${valueExists === 2 ? 'animate-spin' : ''} ${valueExists === 1 ? 'text-red-500' : valueExists === 0 ? 'text-green-500' : ''}`}>
          <FontAwesomeIcon icon={existSwitch(valueExists)} />
        </div>
      </div>
      <p className="h-4 text-[0.75rem] text-red-500">{errors[field] && errors[field].message}</p>
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
      <label 
        className="text-sm lg:text-base font-bold after:ml-0.5 after:text-red-500 after:content-['*']"
        htmlFor="password"
      >
        Password
      </label>
      <div className="flex justify-between bg-[#ededed] dark:bg-[#171717] border-1 border-gray-500 rounded-md">
        <input 
          className="flex-1 w-full p-1 px-2 text-sm lg:text-base"
          type={passwordVisibility ? 'text' : 'password'} 
          {...register('password', {
            onChange: () => {
              trigger('confirm');
            }
          })}
          autoComplete="off"
        />
        <button 
          className="px-2 cursor-pointer hover:[&>*]:text-cyan-500 hover:[&>*]:scale-110 [&>*]:transition-all [&>*]:ease-in-out [&>*]:duration-150"
          type="button" 
          onClick={() => setPasswordVisibility(!passwordVisibility)}
        >
          <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
        </button>
      </div>
      <p className="h-3 text-[0.75rem] text-red-500">{errors.password?.types && errors.password?.types['too_big']}</p>
      <div>
        <p className="text-sm">Password must:</p>
        <ul className="flex flex-col text-[0.75rem]">
          {passwordErrorsArray.map((error) => {
            const errorIncluded = errorArray.includes(error);

            return (
              <li 
                className={`${errorIncluded ? 'text-red-500' : 'text-green-500'}`}
                key={error}
              >
                <FontAwesomeIcon icon={errorIncluded ? faX : faCheck} />
                {error}
              </li>
            );
          })}
        </ul>
      </div>
      <label 
        className="text-sm lg:text-base font-bold after:ml-0.5 after:text-red-500 after:content-['*']"
        htmlFor="confirm"
      >
        Confirm Password
      </label>
      <div className="flex justify-between bg-[#ededed] dark:bg-[#171717] border-1 border-gray-500 rounded-md">
        <input 
          className="flex-1 w-full p-1 px-2 text-sm lg:text-base"
          type={confirmVisibility ? 'text' : 'password'} 
          {...register('confirm')}
          placeholder="Re-enter Password"
          autoComplete="off"
        />
        <button 
          className="px-2 cursor-pointer hover:[&>*]:text-cyan-500 hover:[&>*]:scale-110 [&>*]:transition-all [&>*]:ease-in-out [&>*]:duration-150"
          type="button" 
          onClick={() => setConfirmVisibility(!confirmVisibility)}
        >
          <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
        </button>
      </div>
      <p className="h-4 mb-2 text-[0.75rem] text-red-500">{errors.confirm && errors.confirm.message}</p>
    </>
  );
}

type ValueExists = 0 | 1 | 2;