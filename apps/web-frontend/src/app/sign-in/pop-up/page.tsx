'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PopUp() {

  const authParty = useSearchParams().get('auth-party');

  useEffect(() => {
    const channel = new BroadcastChannel(authParty ? authParty : 'auth');
    channel.postMessage('Authenticated');
    channel.close();
    window.close();
  }, []);

  return (
    <div hidden>This page should be Closed upon being Routed to it, IF it is a Pop Up Window</div>
  );
}
