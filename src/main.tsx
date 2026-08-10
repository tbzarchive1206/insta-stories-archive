import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import archiveData from "../app/data/archive.generated.json";
import { StoriesArchive, type Archive } from "./StoriesArchive";
import "./styles.css";
import "./audio.css";
import "./insta.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoriesArchive data={archiveData as Archive} />
  </StrictMode>,
);
