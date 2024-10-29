import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSignInSchema, AuthSignInSchemaType } from "./auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/global/form-provider/custom-input";
import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomLoader from "@/features/global/ui/custom-loader";
import CustomPasswordInput from "@/features/global/form-provider/custom-password-input";

export default function SignInInputs() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuthActions();

  const form = useForm<AuthSignInSchemaType>({
    resolver: zodResolver(AuthSignInSchema),
  });

  const onPasswordSignIn = async (values: AuthSignInSchemaType) => {
    setPending(true);

    signIn("password", {
      email: values.email,
      password: values.password,
      flow: "signIn",
    })
      .then(() => {
        toast({
          title: "Success",
          description: `Successfully Signed Up User`,
        });
        router.push("/");
      })
      .catch((error) => {
        setError(error);
        console.log(error);
        toast({
          title: "Error",
          description: "your are not signed in sign up first",
          variant: "destructive",
        });
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-y-3 "
        onSubmit={form.handleSubmit(onPasswordSignIn)}
      >
        <CustomInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter your Email"
          disabled={pending}
          icon={MailIcon}
        />
        <CustomPasswordInput
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your Passwword"
          disabled={pending}
          icon={LockIcon}
        />

        {error && <span className="text-destructive">{error}</span>}

        <Button
          size="default"
          className="w-full"
          type="submit"
          disabled={pending}
        >
          {pending ? <CustomLoader title="signing in..." /> : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
