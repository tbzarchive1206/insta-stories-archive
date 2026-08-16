import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import archiveData from "../app/data/archive.generated.json";
import formerMembers from "../app/data/former-members.generated.json";
import { StoriesArchive, type Archive } from "./StoriesArchive";
import "./styles.css";
import "./audio.css";
import "./insta.css";

const currentArchive = archiveData as Archive;
const currentNames = new Set(currentArchive.members.map((member) => member.name));
const completeArchive: Archive = {
  ...currentArchive,
  members: [...currentArchive.members, ...(formerMembers as Archive["members"]).filter((member) => !currentNames.has(member.name))],
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoriesArchive data={completeArchive} />
  </StrictMode>,
);
