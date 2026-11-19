import { useState } from "react";

import { useParams } from "react-router-dom";
import { Button, List, ListItem } from "@mui/material";
import { Male, Female } from "@mui/icons-material";

import { type Patient, Diagnosis } from "../../../../backend/types.ts";

import { PatientDetail } from "./components/PatientDetail.tsx";

export const PatientEntry = ({
  patientList,
  diagnosisCodes,
}: {
  patientList: Patient[];
  diagnosisCodes: Diagnosis[];
}) => {
  const [visible, setVisible] = useState(false);

  const id = useParams().id;
  const patient = patientList.find((p) => p.id === id);

  if (!patient) {
    return <h2>404: Page not found</h2>;
  }

  return (
    <div>
      <h2>
        {patient.name} {patient.gender === "male" ? <Male /> : <Female />}
      </h2>
      <List>
        <ListItem>SSN: {patient.ssn}</ListItem>
        <ListItem>Occupation: {patient.occupation}</ListItem>
        <ListItem>Date Of Birth: {patient.dateOfBirth}</ListItem>
      </List>
      {patient.entries.length !== 0 ? (
        <PatientDetail patient={patient} diagnosisCodes={diagnosisCodes} />
      ) : (
        <h3>No entries added</h3>
      )}
      {!visible ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setVisible(!visible)}
        >
          Add patient record
        </Button>
      ) : (
        <form>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setVisible(!visible)}
          >
            Add
          </Button>
        </form>
      )}
    </div>
  );
};
