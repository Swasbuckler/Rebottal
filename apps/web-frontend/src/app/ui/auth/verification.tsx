'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { otpLength } from "@rebottal/app-definitions";
import axios from "axios";
import { Dispatch, KeyboardEvent, SetStateAction, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export default function VerificationForm({
  otpSent
}: {
  otpSent: boolean
}) {

  return (
    <>
      <OTPForm otpSent={otpSent} />
    </>
    
  );

}

const inputOTPCodeSchema = z.object({
  input0: z.string(),
  input1: z.string(),
  input2: z.string(),
  input3: z.string(),
  input4: z.string(),
  input5: z.string(),
}).refine((data) => {
  for (const field in data) {
    if (!(/^\d$/.test(data[field as keyof InputOTPCode]))) {
      return false;
    }
  }
  return true;
}, {error: 'Enter a valid OTP code'});

type InputOTPCode = z.infer<typeof inputOTPCodeSchema>;

function OTPForm({
  otpSent
}: {
  otpSent: boolean
}) {

  const [disabled, setDisabled] = useState(!otpSent);
  const [currentIndex, setCurrentIndex] = useState(0);
  const otpFormRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue,
    setFocus,
    getValues,
    reset
  } = useForm<InputOTPCode>({
    resolver: zodResolver(inputOTPCodeSchema),
  });

  const submitOTPCode: SubmitHandler<InputOTPCode> = async (data) => {
    if (disabled) {
      return;
    }
    const formData = new FormData();
    formData.append('otpCode', Object.values(data).join(''));

    const response = await axios.post(
      '/api/auth/verification/submit', 
      formData
    );
  }

  const triggerSubmit = () => {
    handleSubmit(submitOTPCode)();
  };

  const handleChange = async (index: number) => {
    const value = getValues(`input${index}` as keyof InputOTPCode);

    if (/^\d$/.test(value)) {
      if (index < otpLength - 1) {
        setFocus(`input${index + 1}` as keyof InputOTPCode);
        setCurrentIndex(index + 1);
      } else {
        handleSubmit(submitOTPCode)();
      }
    } else {
      setValue(`input${index}` as keyof InputOTPCode, '');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && getValues(`input${index}` as keyof InputOTPCode) === '') {

      if (index > 0) {
        setFocus(`input${index - 1}` as keyof InputOTPCode);
      }
    }
  };

  return (
    <>
      <form 
        className="flex flex-row"
        onSubmit={handleSubmit(submitOTPCode)}
        onClick={() => {
          setFocus(`input${currentIndex}` as keyof InputOTPCode)
        }}
        ref={otpFormRef}
      >
        {Array(otpLength).fill('').map((_, index) => {
          return (
            <input 
              key={index}
              type="text" 
              {...register(`input${index}` as keyof InputOTPCode, {
                onChange: () => {handleChange(index)}
              })}
              autoComplete="off"
              disabled={disabled || isSubmitting}
              tabIndex={-1}
              onKeyDown={(event) => {handleKeyDown(event, index)}}
            />
          )
        })}
      </form>
      <div className="flex flex-row justify-between">
        <RequestOTP 
          otpSent={otpSent} 
          setDisabled={setDisabled}
        />
        <button 
          type="button"
          onClick={() => {console.log('test');reset()}}
        >
          Clear OTP
        </button>
      </div>
    </>
  );
}

function RequestOTP({
  otpSent,
  setDisabled
}: {
  otpSent: boolean,
  setDisabled: Dispatch<SetStateAction<boolean>>
}) {

  const [requested, setRequested] = useState(otpSent);

  const handleClick = async () => {
    if (!requested) {
      setRequested(true);
    }

    setDisabled(() => true);

    const response = await axios.post(
      '/api/auth/verification/request'
    );

    if (response.status === 200) {
      setDisabled(() => false);
    } 
  }

  return (
    <button 
      type="button"
      onClick={() => handleClick()}
    >
      {requested ? 'Resend OTP to Email' : 'Send OTP to Email'}
    </button>
  );
}