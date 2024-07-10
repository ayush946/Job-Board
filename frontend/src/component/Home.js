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
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { styled } from "@mui/system";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "30px",
  margin: "20px 0",
  boxSizing: "border-box",
  width: "100%",
}));

const StyledModalPaper = styled(Paper)(({ theme }) => ({
  padding: "20px",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: "50%",
  alignItems: "center",
}));

const StyledModalPaperFilter = styled(Paper)(({ theme }) => ({
  padding: "50px",
  outline: "none",
  minWidth: "50%",
}));

const JobTile = (props) => {
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const handleApply = () => {
    axios
      .post(
        `${apiList.applications}/new`,
        { jobId: job?._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });

      });
  };

  const dateOfPosting = new Date(job?.dateOfPosting).toLocaleDateString();

  return (
    <StyledPaper elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job?.title}</Typography>
          </Grid>
          <Grid item>Role: {job?.jobType}</Grid>
          <Grid item>Salary: &#8377; {job?.salary} per month</Grid>
          <Grid item>Date of Posting: {dateOfPosting}</Grid>
          <Grid item>Location: {job?.location}</Grid>
          {/* <Grid item>Years of Experience Required: {job?.yearsOfExperienceReq}</Grid> */}
          {/* <Grid item>Posted By: {job?.recruiter?.name}</Grid> */}
          <Grid item>
            {job?.skills.map((skill, index) => (
              <Chip key={index} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={userType() === "recruiter"}
            style={{ width: "100%", height: "100%" }}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  const handleApplyFilters = () => {
    getData(); // Fetch data with updated filters
    handleClose(); // Close the filter modal
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledModalPaperFilter>
        <Grid container direction="column" alignItems="center" spacing={3}>
          {/* Job Type */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid container item xs={9} justifyContent="space-around">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Salary */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value * 1000} // Display in INR
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          {/* Location */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Location
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Location"
                variant="outlined"
                fullWidth
                value={searchOptions.location}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    location: event.target.value,
                  })
                }
              >
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="On-site">On-site</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {/* Sort */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container xs={9} direction="row">
              {["salary"].map((sortType) => (
                <Grid
                  item
                  container
                  xs={4}
                  justifyContent="space-around"
                  alignItems="center"
                  key={sortType}
                  style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
                >
                  <Grid item>
                    <Checkbox
                      name={sortType}
                      checked={searchOptions.sort[sortType].status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [sortType]: {
                              ...searchOptions.sort[sortType],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id={sortType}
                    />
                  </Grid>
                  <Grid item>
                    <label htmlFor={sortType}>
                      <Typography>
                        {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort[sortType].status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [sortType]: {
                              ...searchOptions.sort[sortType],
                              desc: !searchOptions.sort[sortType].desc,
                            },
                          },
                        });
                      }}
                    >
                      {searchOptions.sort[sortType].desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              style={{ marginTop: "20px" }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </StyledModalPaperFilter>
    </Modal>
  );
};




const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    location: "",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] !== 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] !== 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.location !== "") {
      searchParams = [...searchParams, `location=${searchOptions.location}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs + "/posted";
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching jobs",
        });
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        sx={{ padding: 3, minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Jobs</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 500 }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
          <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justifyContent="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobTile job={job} key={job?._id} />
            ))
          ) : (
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              No jobs found
            </Typography>
          )}
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Home;