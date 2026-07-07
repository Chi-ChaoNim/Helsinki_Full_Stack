import type { CoursePart } from "../App";
import { Part } from "./Part";

export const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((p) => (
        <p key={p.name}>
          <Part coursePart={p} />
        </p>
      ))}
    </div>
  );
};
