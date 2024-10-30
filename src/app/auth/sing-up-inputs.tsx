"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LockIcon, MailIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthSignUpSchema, AuthSignUpSchemaType } from "@/app/auth/auth.types";
import CustomInput from "@/features/global/form-provider/custom-input";
import CustomLoader from "@/features/global/ui/custom-loader";
import CustomPasswordInput from "@/features/global/form-provider/custom-password-input";
import { toast } from "sonner";

const SignUpInputs = () => {
  const { signIn } = useAuthActions();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<AuthSignUpSchemaType>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onPasswordSignIn = (values: AuthSignUpSchemaType) => {
    setPending(true);

    signIn("password", {
      email: values.email,
      password: values.password,
      name: values.name,
      flow: "signUp",
    })
      .then(() => {
        toast.success("sign in succcessfully");
        router.push("/");
      })

      .catch((error) => {
        setError(error);
        console.log(error);
        toast.error("you are not signed up , create account");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onPasswordSignIn)}
        className=" space-y-2 flex flex-col "
      >
        <CustomInput
          control={form.control}
          label="Full Name"
          disabled={pending}
          name="name"
          icon={MailIcon}
          placeholder="Enter your name here"
        />

        <CustomInput
          control={form.control}
          name="email"
          label="Email"
          disabled={pending}
          placeholder="Enter Your Email"
        />
        <CustomPasswordInput
          control={form.control}
          label="Password"
          name="password"
          disabled={pending}
          placeholder="Enter Your Password"
          icon={LockIcon}
        />

        <CustomPasswordInput
          control={form.control}
          label="Confirm Password"
          name="confirmPassword"
          disabled={pending}
          icon={LockIcon}
          placeholder="Confirm Your Password"
        />

        {!!error && (
          <div className="flex  h-8 rounded-lg flex-row bg-red-500/50 items-center justify-center px-4">
            <TriangleAlertIcon className="  size-3.5" />
            <p className="p-3 rounded-lg ">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full my-4" disabled={pending}>
          {pending ? <CustomLoader title="signing up..." /> : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpInputs;
