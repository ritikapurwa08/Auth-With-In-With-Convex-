import { Button } from "@/components/ui/button";
import React from "react";

const HeroPage = () => {
  return (
    <div className="flex justify-center items-center w-full  flex-col gap-y-10">
      <div className="prose prose-lg mx-auto pt-10 text-center">
        <h1 className="">Oragnize, Share & Collaborate with ease.</h1>
        <p>
          Save and organize your code snippets in the cloud. Single Page Website
          , Eccormerse Apps, and much more.
        </p>
      </div>

      <div className="mx-auto flex flex-row gap-x-4 ">
        <Button variant="outline">Admin Login</Button>
        <Button variant="outline">Contact</Button>
      </div>
    </div>
  );
};

export default HeroPage;
