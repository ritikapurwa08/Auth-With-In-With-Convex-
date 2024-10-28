import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import UpdateSnippetModal from "./use-update-snippets-modal";

type SmallCodeProps = {
  code: Doc<"snippets">;
};

const SmallCodeCard = ({ code }: SmallCodeProps) => {
  return (
    <div>
      <div>
        <h1>{code._id}</h1>
        <p>{code.projectName}</p>
      </div>
      <UpdateSnippetModal id={code._id} />
    </div>
  );
};

export default SmallCodeCard;
