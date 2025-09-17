'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { boardcastSignInAuthPost } from '../../lib/auth/third-party-sign-in';

export default function PopUp() {

  const authParty = useSearchParams().get('auth-party');

  useEffect(() => {
    boardcastSignInAuthPost(authParty);
    window.close();
  }, []);

  return (
    <div hidden>This page should be Closed upon being Routed to it, IF it is a Pop Up Window</div>
  );
}
