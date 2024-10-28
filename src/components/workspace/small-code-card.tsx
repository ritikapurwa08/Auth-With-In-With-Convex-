import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import UpdateSnippetModal from "./use-update-snippets-modal";
import { useCurrentUser } from "@/api/user";

type SmallCodeProps = {
  code: Doc<"snippets">;
};

const SmallCodeCard = ({ code }: SmallCodeProps) => {
  const { isLoading, user } = useCurrentUser();

  const isAdmin = code.userId === user?._id;
  return (
    <div>
      <div>
        <h1>{code._id}</h1>
        <p>{code.projectName}</p>
      </div>
      {isAdmin && <UpdateSnippetModal id={code._id} />}
    </div>
  );
};

export default SmallCodeCard;
