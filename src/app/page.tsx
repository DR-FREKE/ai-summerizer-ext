"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

interface CustomSession extends Session {
  accessToken: string;
}

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("sessionss", (session as CustomSession)?.accessToken);
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* {session?.user?.email} */}
      {JSON.stringify((session as CustomSession)?.accessToken)}
    </main>
  );
}
