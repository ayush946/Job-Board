import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = (theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
});

const JobTile = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    navigate(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        getData();
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper sx={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Role : {job.jobType}</Grid>
          <Grid item>Salary : &#8377; {job.salary} per month</Grid>
          <Grid item>
            Duration :{" "}
            {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item>Date Of Posting: {postedOn.toLocaleDateString()}</Grid>
          <Grid item>Number of Applicants: {job.maxApplicants}</Grid>
          <Grid item>
            Remaining Number of Positions:{" "}
            {job.maxPositions - job.acceptedCandidates}
          </Grid>
          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip key={skill} label={skill} sx={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Button
              variant="contained"
              color="primary"
              sx={classes.statusBlock}
              onClick={() => handleClick(`/job/applications/${job._id}`)}
            >
              View Applications
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ ...classes.statusBlock, background: "#FC7A1E", color: "#fff" }}
              onClick={() => {
                setOpenUpdate(true);
              }}
            >
              Update Details
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              sx={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
            >
              Delete Job
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} sx={classes.popupDialog}>
        <Paper
          sx={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal open={openUpdate} onClose={handleCloseUpdate} sx={classes.popupDialog}>
        <Paper
          sx={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid container direction="column" spacing={3} sx={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => handleInput("deadline", event.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => handleInput("maxApplicants", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => handleInput("maxPositions", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ padding: "10px 50px" }}
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
    const classes = useStyles();
    const { open, setOpen, applyFilters, filters, setFilters } = props;
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleApplyFilters = () => {
      applyFilters(filters);
      handleClose();
    };
  
    const handleFilterChange = (event) => {
      setFilters({
        ...filters,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleCheckboxChange = (event) => {
      setFilters({
        ...filters,
        [event.target.name]: event.target.checked,
      });
    };
  
    return (
      <Modal open={open} onClose={handleClose} sx={classes.popupDialog}>
        <Paper
          sx={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Filter Jobs
          </Typography>
          <Grid container direction="column" spacing={3} sx={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Job Title"
                name="title"
                variant="outlined"
                value={filters.title}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Company"
                name="company"
                variant="outlined"
                value={filters.company}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Location"
                name="location"
                variant="outlined"
                value={filters.location}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Min Salary"
                name="minSalary"
                type="number"
                variant="outlined"
                value={filters.minSalary}
                onChange={handleFilterChange}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Max Salary"
                name="maxSalary"
                type="number"
                variant="outlined"
                value={filters.maxSalary}
                onChange={handleFilterChange}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.fullTime}
                      onChange={handleCheckboxChange}
                      name="fullTime"
                    />
                  }
                  label="Full Time"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.partTime}
                      onChange={handleCheckboxChange}
                      name="partTime"
                    />
                  }
                  label="Part Time"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.internship}
                      onChange={handleCheckboxChange}
                      name="internship"
                    />
                  }
                  label="Internship"
                />
              </FormGroup>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ padding: "10px 50px" }}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ padding: "10px 50px", marginLeft: "10px" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  };
  
  const MyJobs = (props) => {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
      title: "",
      company: "",
      location: "",
      minSalary: "",
      maxSalary: "",
      fullTime: false,
      partTime: false,
      internship: false,
    });
    const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  
    useEffect(() => {
      fetchJobs();
    }, []);
  
    const fetchJobs = async () => {
      try {
        const response = await axios.get(apiList.jobs, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: filters,
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    const applyFilters = (filters) => {
      setFilters(filters);
      fetchJobs();
    };
  
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterPopupOpen(true)}
        >
          Filter
        </Button>
        <FilterPopup
          open={filterPopupOpen}
          setOpen={setFilterPopupOpen}
          applyFilters={applyFilters}
          filters={filters}
          setFilters={setFilters}
        />
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <JobTile job={job} getData={fetchJobs} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };
  
  export default MyJobs;
  