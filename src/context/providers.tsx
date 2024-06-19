"use client";

import React, { ReactNode } from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5 * 60 * 1000} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};

export default Providers;
