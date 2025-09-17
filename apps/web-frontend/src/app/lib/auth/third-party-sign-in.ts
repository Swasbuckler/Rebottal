export function boardcastSignInAuthPost(authParty: string | null) {
  const channel = new BroadcastChannel(authParty ? authParty : 'auth');
  channel.postMessage('Authenticated');
  channel.close();
}

export function boardcastSignInAuthReceive(authParty: string) {
  const channel = new BroadcastChannel(authParty);
  channel.addEventListener('message', (event) => {
    if (event.origin === process.env.NEXT_PUBLIC_FRONTEND_URL!) {
      if (event.data === 'Authenticated') {
        channel.close();
      }
    } else {
      console.warn("Untrusted message origin:", event.origin);
    }
  });
}