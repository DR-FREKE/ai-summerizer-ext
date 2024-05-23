"use client";

import { AppButton } from "@/components/button";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  /** method to handle google sign in request */
  const handleGoogleSingIn = () => {
    signIn("google");
  };

  return (
    <div className="p-10 flex items-center gap-5">
      <h3>SignIn Page</h3>
      <AppButton name="Sign in" onPress={handleGoogleSingIn} />
    </div>
  );
};

export default SignInPage;
