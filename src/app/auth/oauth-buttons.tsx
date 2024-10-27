import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function OAuthButtons() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const onProviderSignIn = (useWith: "github" | "google") => {
    signIn(useWith);
    router.push("/create-or-join");
  };

  return (
    <section className="grid grid-cols-2 w-full gap-x-4  pb-2  ">
      <div
        onClick={() => onProviderSignIn("google")}
        className="border flex flex-row text-center h-10 items-center  border-zinc-800"
      >
        <FcGoogle className="size-6 ml-2 " />
        <span className="w-full flex justify-center">Google</span>
      </div>
      <div
        onClick={() => onProviderSignIn("github")}
        className="border flex flex-row text-center items-center  border-zinc-800"
      >
        <SiGithub className="size-6 ml-2 " />
        <span className="w-full flex justify-center">GitHub</span>
      </div>
    </section>
  );
}
