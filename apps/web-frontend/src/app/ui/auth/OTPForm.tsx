'use client';

import axiosInstance from "@/app/lib/auth/axios-instance";
import { useUpdateEffect } from "@/app/lib/utils/useUpdateEffect";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailFormSchema, otpLength, SubmitOTPCode, submitOTPCodeSchema } from "@rebottal/app-definitions";
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

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

export default function OTPForm({
  email,
  otpEndPoint,
  otpSent = true,
  otpExpiresAt = new Date(Date.now())
}: {
  email: string,
  otpEndPoint: string,
  otpSent?: boolean,
  otpExpiresAt?: Date
}) {

  const [disabled, setDisabled] = useState(!otpSent);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [otpExpiry, setOTPExpiry] = useState(otpExpiresAt);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const [countdownDeadline, setCountdownDeadline] = useState('0:00');

  const otpFormRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: {isSubmitting},
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

    const rawInput: SubmitOTPCode = {
      email: email,
      otpCode: Object.values(data).join(''),
    };

    const validatedFields = submitOTPCodeSchema.safeParse(rawInput);
    if (!validatedFields.success) {
      return;
    }
  
    const otpData: SubmitOTPCode = {
      email: validatedFields.data.email,
      otpCode: validatedFields.data.otpCode,
    };
  
    await axiosInstance.post(
      `/api/auth${otpEndPoint}/submit`,
      otpData
    );
  };
  
  const handleCountdown = () => {
    const now = new Date(Date.now());
    const diff = otpExpiry.getTime() - now.getTime();
    
    if (!countdownInterval.current) {
      return;
    }
    if (diff < 0) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
      setDisabled(true);
      return;
    }

    const secondsDivide = 1000;
    const minutesDivide = secondsDivide * 60;

    const seconds = Math.floor(diff / secondsDivide) % 60;
    const minutes = Math.floor(diff / minutesDivide) % 60;

    setCountdownDeadline(`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}`: seconds}`);
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
        setCurrentIndex(index - 1);
      }
    }
  };

  useUpdateEffect(() => {

    const newCountdownInterval = setInterval(handleCountdown, 1000);
    countdownInterval.current = newCountdownInterval;

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }
  }, [otpExpiry]);

  return (
    <>
      <div>
        <form 
          className="flex justify-center gap-2 w-full mb-2"
          onSubmit={handleSubmit(submitOTPCode)}
          onClick={() => {
            setFocus(`input${currentIndex}` as keyof InputOTPCode)
          }}
          ref={otpFormRef}
        >
          {Array(otpLength).fill('').map((_, index) => 
            <input 
              className="text-xl text-center w-7 sm:size-10 md:size-13 border-1 border-gray-500 rounded-md disabled:bg-gray-500"
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
          )}
        </form>
        <div className="h-4 text-sm lg:text-base text-center">Your OTP will expire in: {countdownDeadline}</div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <RequestOTP 
          email={email}
          otpEndPoint={otpEndPoint}
          otpSent={otpSent} 
          setDisabled={setDisabled}
          setOTPExpiry={setOTPExpiry}
        />
        <button 
          className="text-sm lg:text-base cursor-pointer"
          type="button"
          onClick={() => {reset()}}
        >
          Clear OTP
        </button>
      </div>
    </>
  );
}

function RequestOTP({
  email,
  otpEndPoint,
  otpSent,
  setDisabled,
  setOTPExpiry,
}: {
  email: string,
  otpEndPoint: string,
  otpSent: boolean,
  setDisabled: Dispatch<SetStateAction<boolean>>
  setOTPExpiry: Dispatch<SetStateAction<Date>>
}) {

  const [requested, setRequested] = useState(otpSent);

  const [delay, setDelay] = useState(new Date(Date.now()));
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const [countdownDeadline, setCountdownDeadline] = useState('0:00');

  const handleCountdown = () => {
    const now = new Date(Date.now());
    const diff = delay.getTime() - now.getTime();
    
    if (!countdownInterval.current) {
      return;
    }
    if (diff < 0) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
      return;
    }

    const secondsDivide = 1000;
    const minutesDivide = secondsDivide * 60;

    const seconds = Math.floor(diff / secondsDivide) % 60;
    const minutes = Math.floor(diff / minutesDivide) % 60;

    setCountdownDeadline(`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}`: seconds}`);
  };

  const handleClick = async () => {
    if (!requested) {
      setRequested(true);
    }

    setDelay(new Date(Date.now() + (1000 * 30)));

    const rawInput = {
      email: email
    };

    const validatedFields = emailFormSchema.safeParse(rawInput);
    if (!validatedFields.success) {
      return;
    }
  
    const emailData = {
      email: validatedFields.data.email,
    };

    try {
      const response = await axiosInstance.post(
        `/api/auth${otpEndPoint}/request`,
        emailData
      );

      setDisabled(() => true);

      if (response.status === 200) {
        setDisabled(() => false);
        setOTPExpiry(() => new Date(response.data.otpExpiresAt));
      } 
    } catch (error: any) {
      
    }
  }

  useUpdateEffect(() => {

    const newCountdownInterval = setInterval(handleCountdown, 1000);
    countdownInterval.current = newCountdownInterval;

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }
  }, [delay]);

  return (
    <div className="flex gap-1">
      <button 
        className="text-sm lg:text-base cursor-pointer disabled:text-gray-500"
        type="button"
        onClick={() => handleClick()}
        disabled={countdownInterval.current ? true : false}
      >
        {requested ? 'Resend OTP' : 'Send OTP'}
      </button>
      <p className={`text-sm lg:text-base ${countdownInterval.current ? '' : 'hidden'}`}>{countdownDeadline}</p>
    </div>
  );
}