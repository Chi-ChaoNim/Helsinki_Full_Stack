import type { CoursePart } from "../App";

export const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <p>
            <strong>
              {coursePart.name}: {coursePart.exerciseCount}
            </strong>{" "}
            <br />
            <i>{coursePart.description}</i>
          </p>
        </div>
      );
    case "group":
      return (
        <div>
          <p>
            <strong>
              {coursePart.name}: {coursePart.exerciseCount}
            </strong>{" "}
            <br />
            Group projects: {coursePart.groupProjectCount}
          </p>
        </div>
      );
    case "background":
      return (
        <div>
          <p>
            <strong>
              {coursePart.name}: {coursePart.exerciseCount}
            </strong>{" "}
            <br />
            <i>{coursePart.description}</i> <br />
            Submit to: {coursePart.backgroundMaterial},
          </p>
        </div>
      );
    case "special":
      return (
        <div>
          <p>
            <strong>
              {coursePart.name}: {coursePart.exerciseCount}
            </strong>{" "}
            <br />
            <i>{coursePart.description}</i> <br />
            Required skills: {coursePart.requirements.map((r) => `${r}, `)}
          </p>
        </div>
      );
  }
};
