import Link from "next/link";

export default function Home() {
  
  return (
    <div className="flex flex-col gap-5">
      <Link href={'/sign-up'}>Sign Up</Link>
      <Link href={'/log-in'}>Log In</Link>
    </div>
  );
}
