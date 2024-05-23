"use client";

import { AppButton } from "@/components/button";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Google } from "iconsax-react";
import Image from "next/image";

export const Header = () => {
  const { data: session } = useSession();

  /** method to handle google sign in request */
  const handleGoogleSingIn = () => {
    signIn("google");
  };

  return (
    <header className="border-b py-3 px-10 flex items-center justify-between gap-5">
      <h3>Logo</h3>
      {/** coming back to this */}
      {session ? (
        <div className="flex items-center gap-3">
          <Image
            src={session?.user?.image!}
            alt=""
            width={"40"}
            height={"40"}
            quality={"95"}
            priority={true}
            className="rounded-full"
          />
          <span>{session?.user?.name}</span>
        </div>
      ) : (
        <AppButton
          name="Sign in"
          onPress={handleGoogleSingIn}
          className="bg-transparent border text-gray-700 px-2 font-medium text-sm"
          icon={<Google size={22} />}
        />
      )}
    </header>
  );
};
