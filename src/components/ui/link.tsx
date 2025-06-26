"use client";

import Link from "next/link";
import NProgress from "nprogress";
import { ComponentProps } from "react";

const AuthLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      href={href}
      onClick={() => {
        NProgress.start();
      }}
      {...props}
    />
  );
}

export { AuthLink as Link };