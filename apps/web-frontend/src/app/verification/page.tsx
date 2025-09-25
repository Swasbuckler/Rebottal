'use client';

import VerificationForm from "../ui/auth/VerificationForm";

export default function Verification() {

  return (
    <div>
      <VerificationForm otpSent={true} />
    </div>
  );
}
