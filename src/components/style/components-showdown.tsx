import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  EditIcon,
  FileIcon,
  FlagIcon,
  HeartIcon,
  MessagesSquareIcon,
  MoreVerticalIcon,
  ReplyIcon,
  UploadCloudIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const ComponentShowDown = () => {
  const ElementCollectionLogo = () => {
    return (
      <div className="flex flex-row items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative size-24">
          <div className="absolute size-20 bg-emerald-200 rounded-lg blur-sm transform rotate-6" />
          <div className="absolute -top-3 text-7xl font-bold text-center size-full -right-3 bg-emerald-400 rounded-lg flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            E
          </div>
        </div>
        <div className="flex m-0 p-0 pl-6 flex-col prose-p:m-0 prose-p:p-0 prose prose-lg">
          <p className="text-2xl font-bold text-gray-800">Element</p>
          <p className="text-gray-600">element collections</p>
        </div>
      </div>
    );
  };

  const NormalBlogCard = () => {
    return (
      <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            This is nice blog title
          </CardTitle>
          <CardDescription className="text-gray-600">
            Explore amazing content
          </CardDescription>
          <CardFooter className="flex flex-row justify-between items-center pt-4 space-x-4">
            <Button variant="outline" className="hover:bg-gray-100">
              Maybe Later
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Read Now
            </Button>
          </CardFooter>
        </CardHeader>
      </Card>
    );
  };

  const BlogCardWithImage = () => {
    const blogImage =
      "https://cdn.pixabay.com/photo/2018/04/29/04/37/flower-3359072_1280.jpg";
    return (
      <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            This is Blog with Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full relative rounded-lg overflow-hidden">
            <Image
              src={blogImage}
              height={500}
              width={500}
              className="w-full h-64 object-cover hover:scale-105 transition-all duration-300"
              alt="show-blog-image"
            />
            <div className="absolute top-4 right-4 size-12">
              <div className="rounded-full">
                <HeartIcon className=" text-red-400 hover:fill-red-500 transition-all duration-300 ease-in-out" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const UploadButton = () => {
    return (
      <div className="bg-white p-4  rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center space-y-2">
        <div className="bg-violet-100 p-4 rounded-full">
          <UploadCloudIcon size={32} className="text-violet-600" />
        </div>
        <span className="text-gray-700 font-medium">Upload</span>
      </div>
    );
  };

  const EditOptions = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        {[
          { icon: <ReplyIcon />, label: "Reply", color: "text-blue-600" },
          { icon: <EditIcon />, label: "Edit", color: "text-emerald-600" },
          { icon: <FlagIcon />, label: "Flag", color: "text-red-600" },
        ].map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-300"
          >
            <div className={`${option.color}`}>{option.icon}</div>
            <span className="text-gray-700">{option.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const DashboardDesign = ({ enableChat }: { enableChat: boolean }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-violet-600 h-16 w-1.5 rounded-full" />
        <div className="flex-1 space-y-1">
          <span className="text-lg font-semibold text-gray-800 block">
            Dashboard Design
          </span>
          <span className="text-violet-600 text-sm font-medium">@ui/ux</span>
        </div>
        <div className="flex space-x-2">
          {enableChat && (
            <MessagesSquareIcon className="text-gray-600 hover:text-violet-600 cursor-pointer" />
          )}
          <MoreVerticalIcon className="text-gray-600 hover:text-violet-600 cursor-pointer" />
        </div>
      </div>
    );
  };

  const PeopleAvatar = ({
    text,
    className,
  }: {
    text: string;
    className: string;
  }) => {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-md hover:scale-110 transition-all duration-300",
          className
        )}
      >
        <span>{text}</span>
      </div>
    );
  };

  const DashBoardDesingWithChat = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <DashboardDesign enableChat={true} />
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Activities</span>
          <span className="bg-violet-100 text-violet-600 rounded-full px-3 py-1 text-sm font-medium">
            12
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">People Working</span>
            <span className="bg-emerald-100 text-emerald-600 rounded-full px-3 py-1 text-sm font-medium">
              7
            </span>
          </div>
          <div className="flex -space-x-2">
            <PeopleAvatar
              text="A"
              className="bg-gradient-to-br from-gray-400 to-zinc-900"
            />
            <PeopleAvatar
              text="X"
              className="bg-gradient-to-br from-teal-400 to-rose-600"
            />
            <PeopleAvatar
              text="P"
              className="bg-gradient-to-br from-cyan-400 to-purple-500"
            />
            <PeopleAvatar
              text="G"
              className="bg-gradient-to-br from-orange-400 to-lime-400"
            />
            <PeopleAvatar
              text="+"
              className="bg-gradient-to-br  from-green-400 to-green-800"
            />
          </div>
        </div>
      </div>
    );
  };

  const StartConversation = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <span className="text-gray-600 font-medium">To</span>
        <div className="space-y-4">
          <Input
            type="text"
            className="border-gray-200 focus:border-violet-500"
            placeholder="Recipients"
          />
          <Textarea
            className="min-h-32 border-gray-200 focus:border-violet-500"
            placeholder="Type your message..."
          />
        </div>
        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" className="hover:bg-gray-50">
            <FileIcon className="mr-2" />
            Attach
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            Post
          </Button>
        </div>
      </div>
    );
  };

  const OnBoarding = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <Input
          type="text"
          placeholder="Board Name"
          className="border-gray-200 focus:border-violet-500"
        />

        <div className="space-y-2">
          <Label
            htmlFor="board-input-id"
            className="flex items-center space-x-2 text-gray-700"
          >
            <InfoCircledIcon className="text-violet-600" />
            <span>Board ID</span>
          </Label>
          <Input
            type="text"
            id="board-input-id"
            className="border-gray-200 focus:border-violet-500"
          />
          <span className="text-emerald-600 text-sm">
            Good work user, you&apos;re nice to go!
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-gray-700 font-medium block">
            Add more board
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="hover:bg-violet-50 border-violet-200"
            >
              @web
            </Button>
            <Button
              variant="outline"
              className="hover:bg-emerald-50 border-emerald-200"
            >
              @ui/ux
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-gray-700 font-medium block">
            Add more people
          </span>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Email address"
              className="border-gray-200 focus:border-violet-500"
            />
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap">
              Invite
            </Button>
          </div>
          <div className="flex -space-x-2">
            <PeopleAvatar
              text="A"
              className="bg-gradient-to-br from-gray-400 to-zinc-900"
            />
            <PeopleAvatar
              text="D"
              className="bg-gradient-to-br from-teal-400 to-rose-600"
            />
            <PeopleAvatar
              text="K"
              className="bg-gradient-to-br from-cyan-400 to-purple-500"
            />
            <PeopleAvatar
              text="R"
              className="bg-gradient-to-br from-orange-400 to-lime-400"
            />
            <PeopleAvatar
              text="+"
              className="bg-gradient-to-br  from-green-400 to-green-800"
            />
          </div>
        </div>

        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          Submit
        </Button>
      </div>
    );
  };

  return (
    <div className="h-auto my-10 bg-gray-50 p-4 md:p-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        <div className="space-y-6 flex flex-col items-end h-full ">
          <div className="w-full">
            <ElementCollectionLogo />
          </div>
          <div className="h-full flex flex-col items-center justify-end">
            <NormalBlogCard />
            <BlogCardWithImage />
          </div>
        </div>

        <div className="space-y-6 flex flex-col min-w-full w-full   justify-end items-center ">
          <div className="grid grid-cols-1 w-full  sm:grid-cols-2 gap-4">
            <UploadButton />
            <EditOptions />
          </div>
          <div className="w-full gap-y-3 flex flex-col">
            <DashboardDesign enableChat={false} />
            <DashBoardDesingWithChat />
          </div>
        </div>

        <div className="space-y-6">
          <StartConversation />
          <OnBoarding />
        </div>
      </div>
    </div>
  );
};

export default ComponentShowDown;
