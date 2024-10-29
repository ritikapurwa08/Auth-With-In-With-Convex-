"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OAuthButtons from "./oauth-buttons";
import { useState } from "react";
import { RegisterType } from "./auth.types";
import SignUpInputs from "@/app/auth/sing-up-inputs";
import SignInInputs from "./sign-in-inputs";
import { Button } from "@/components/ui/button";
const Page = () => {
  const [RegisterType, setRegisterType] = useState<RegisterType>("signIn");
  const handleRegisterType = () => {
    setRegisterType((prev) => (prev === "signUp" ? "signIn" : "signUp"));
  };
  return (
    <section className="flex items-center  h-[70vh] w-full justify-center max-w-md mx-auto">
      <Card className="p-4 mx-4 w-full">
        <CardHeader>
          <CardTitle>
            {RegisterType === "signUp"
              ? "Create an Account"
              : "Enter your Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OAuthButtons />

          {RegisterType === "signUp" ? <SignUpInputs /> : <SignInInputs />}

          <Button
            onClick={handleRegisterType}
            className="text-muted-foreground w-full justify-start px-0"
            variant="link"
          >
            {RegisterType === "signUp"
              ? " already have an account  ? Sign in "
              : "dont have and account ? Sign Up"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
