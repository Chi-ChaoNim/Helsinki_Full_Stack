import { List, ListItem } from "@mui/material";
import {
  LocalHospital,
  Medication,
  Masks,
  Favorite,
  HeartBroken,
} from "@mui/icons-material";
import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  Patient,
} from "../../../../../backend/types";

export const PatientDetail = ({
  patient,
  diagnosisCodes,
}: {
  patient: Patient;
  diagnosisCodes: Diagnosis[];
}) => {
  const EntryDetails = (entry: Entry) => {
    switch (entry.type) {
      case "HealthCheck":
        return (
          <List key={entry.id}>
            <ListItem>
              {entry.date} <Medication />
            </ListItem>
            <ListItem>{entry.description}</ListItem>
            <ListItem>{HeartSymbol(entry)}</ListItem>
            <ListItem>Diagnosed by: {entry.specialist}</ListItem>
          </List>
        );
      case "Hospital":
        return (
          <List key={entry.id}>
            <ListItem>
              {entry.date} <LocalHospital />
            </ListItem>
            <ListItem>{entry.description}</ListItem>
            <ListItem>Diagnosed by: {entry.specialist}</ListItem>
          </List>
        );
      case "OccupationalHealthcare":
        return (
          <List key={entry.id}>
            <ListItem>
              {entry.date} <Masks />
            </ListItem>
            <ListItem>{entry.description}</ListItem>
            <ListItem>Diagnosed by: {entry.specialist}</ListItem>
          </List>
        );
    }
  };

  const HeartSymbol = (entry: HealthCheckEntry) => {
    switch (entry.healthCheckRating) {
      case 0:
        return <Favorite color="success" />;
      case 1:
        return <Favorite color="warning" />;
      case 2:
        return <Favorite color="error" />;
      case 3:
        return <HeartBroken color="error" />;
    }
  };

  return (
    <div>
      <h3>Patient entries</h3>
      <List>
        {patient.entries.map((e) => {
          return EntryDetails(e);
        })}
      </List>
      <List>
        {patient.entries.map((e) =>
          e.diagnosisCodes ? (
            <div key={e.id}>
              <h4>Diagnosis Code:</h4>
              <List>
                {e.diagnosisCodes.map((d) => {
                  const diag = diagnosisCodes.find((x) => x.code === d);
                  return (
                    <ListItem key={d}>
                      {d} {diag ? diag.name : ""}
                    </ListItem>
                  );
                })}
              </List>
            </div>
          ) : null,
        )}
      </List>
    </div>
  );
};
