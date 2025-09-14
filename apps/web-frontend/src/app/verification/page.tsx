'use client';

import VerificationForm from "../ui/auth/verification";

export default function Verification() {

  return (
    <div>
      <VerificationForm otpSent={true} />
    </div>
  );
}
