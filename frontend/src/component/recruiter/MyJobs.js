import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  Modal,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";

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
      .delete(`${apiList.jobs}/${job?._id}`, {
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
      .put(`${apiList.jobs}/${job?._id}`, jobDetails, {
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

  return (
    <Paper sx={classes.jobTileOuter} elevation={4}>
      <Grid container>
        <Grid container item xs={8} spacing={2} direction="column" >
          <Grid item>
            <Typography variant="h5">{job?.title}</Typography>
          </Grid>
          <Grid item>Job Type : {job?.jobType}</Grid>
          <Grid item>Salary : {job?.salary}</Grid>
          <Grid item>Open Positions : {job?.maxOpenPositions}</Grid>
          {/* <Grid item>YOE : {job?.yearsOfExperienceReq}</Grid> */}
          <Grid item>Location : {job?.location}</Grid>
          <Grid item>
            Skills : {job?.skills.map((skill) => (
              <Chip key={skill} label={skill} sx={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3} spacing={1}>
          <Grid item >
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
            paddingRight: "80px",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid container direction="column" spacing={5} sx={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxOpenPositions}
                onChange={(event) => handleInput("maxOpenPositions", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
                sx={{ paddingBottom: "10px"}}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Salary"
                type="number"
                variant="outlined"
                value={jobDetails.salary}
                onChange={(event) => handleInput("salary", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
                sx={{ paddingBottom: "40px"}}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ padding: "10px 50px", marginLeft: "30px" }}
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
    location: "",
    minSalary: "",
    maxSalary: "",
    fullTime: false,
    partTime: false,
    internship: false,
    yearsOfExperienceReq: 0

  });
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(apiList.jobs + "/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          ...filters,
          page: currentPage,
        },
      });
      setJobs(response.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const applyFilters = (filters) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<FilterListIcon />}
        onClick={() => setFilterPopupOpen(true)}
      >
        Filter
      </Button> */}
      {/* <FilterPopup
        open={filterPopupOpen}
        setOpen={setFilterPopupOpen}
        applyFilters={applyFilters}
        filters={filters}
        setFilters={setFilters}
      /> */}
      <Grid container spacing={4} sx={{ padding: "40px"}}>
        {jobs.length!== 0 ? jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job?._id}>
            <JobTile job={job} getData={fetchJobs} />
          </Grid>
        )): 
        <Grid item container sx={{ display: "flex", justifyContent: "center"}}>
          No jobs posted by you
        </Grid>
      }
      </Grid>
      {jobs.length!== 0 ?
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: "20px", alignSelf: "center" }}
      />: null
      }
    </>
  );
};

export default MyJobs;
