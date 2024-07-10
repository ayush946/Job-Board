import { useState, useEffect, useContext } from "react";
import {
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { styled } from "@mui/system";

const JobTileOuter = styled(Paper)({
  padding: "30px",
  margin: "20px 0",
  boxSizing: "border-box",
  width: "100%",
});

const StatusBlock = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "uppercase",
}));

const ApplicationTile = (props) => {
  const { application } = props;

  const appliedOn = new Date(application?.dateOfApplication);
  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
  };

  return (
    <JobTileOuter elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.jobId?.title}</Typography>
          </Grid>
          <Grid item>Applicant Name : {application.applicantId?.userId?.name.toUpperCase()}</Grid>
          <Grid item>Role : {application.jobId?.jobType}</Grid>
          <Grid item>Salary : &#8377; {application.jobId?.salary} per month</Grid>
          <Grid item>
            {application.jobId?.skills.map((skill) => (
              <Chip key={skill} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <StatusBlock
              style={{
                background: colorSet[application?.status.toLowerCase()],
                height: "40px",
                color: "#ffffff",
              }}
            >
              Status: {application?.status}
            </StatusBlock>
          </Grid>
        </Grid>
      </Grid>
    </JobTileOuter>
  );
};

const Applications = () => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications + "/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Applications</Typography>
      </Grid>
      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="stretch"
        justifyContent="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item key={obj._id}>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
