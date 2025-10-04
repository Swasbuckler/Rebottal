import { boardcastSignInAuthReceive } from "@/app/lib/auth/third-party-sign-in";

export default function SignInThirdPartyButton({
  className,
  thirdPartyEndPoint,
  authParty,
  children
}: {
  className?: string
  thirdPartyEndPoint: string,
  authParty: string,
  children: React.ReactNode
}) {

  return (
    <button 
      className={className}
      type="button" 
      onClick={async () => {
        window.open(`/sign-in${thirdPartyEndPoint}`, 'popup', 'popup=true');
        boardcastSignInAuthReceive(authParty);
      }}
    >
      {children}
    </button>
  );
}