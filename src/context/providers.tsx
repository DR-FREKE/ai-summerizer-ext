"use client";

import React, { ReactNode } from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
