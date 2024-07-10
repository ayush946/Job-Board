import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: "20px",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const CreateJobs = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxOpenPositions: 30,
    skills: [],
    jobType: "Full time",
    location: "Remote",
    salary: 0,
    yearsOfExperienceReq: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs + "/new", jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setJobDetails({
          title: "",
          maxOpenPositions: 30,
          skills: [],
          jobType: "Full time",
          location: "Remote",
          salary: 0,
          yearsOfExperienceReq: 0,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response,
        });
        console.log(err.response);
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
        <Typography variant="h2">Add Job</Typography>
      </Grid>
      <Grid item container xs direction="column" justifyContent="center">
        <Grid item>
          <PaperStyled>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Title"
                  value={jobDetails.title}
                  onChange={(event) =>
                    handleInput("title", event.target.value)
                  }
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={jobDetails.skills}
                  onChange={(event, newValue) => {
                    setJobDetails({
                      ...jobDetails,
                      skills: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Skills"
                      placeholder="Add skills"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Job Type"
                  variant="outlined"
                  value={jobDetails.jobType}
                  onChange={(event) => {
                    handleInput("jobType", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value="Full time">Full time</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Location"
                  variant="outlined"
                  value={jobDetails.location}
                  onChange={(event) => {
                    handleInput("location", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  label="Salary"
                  type="number"
                  variant="outlined"
                  value={jobDetails.salary}
                  onChange={(event) => {
                    handleInput("salary", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Years of Experience Required"
                  type="number"
                  variant="outlined"
                  value={jobDetails.yearsOfExperienceReq}
                  onChange={(event) => {
                    handleInput("yearsOfExperienceReq", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Positions Available"
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxOpenPositions}
                  onChange={(event) => {
                    handleInput("maxOpenPositions", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={handleUpdate}
            >
              Create Job
            </Button>
          </PaperStyled>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;