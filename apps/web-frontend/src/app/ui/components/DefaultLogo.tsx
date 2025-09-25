'use client';

import DefaultLogoSvg from "./DefaultLogoSvg";

export function DefaultLogo({
  className
}: {
  className: string | undefined
}) {

  return (
    <div className={className}>
      <DefaultLogoSvg />
    </div>
  );
}