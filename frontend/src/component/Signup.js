import { useState, useContext } from "react";
import { Grid, TextField, Button, Typography, Paper, MenuItem, Input, Chip, Box } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import DescriptionIcon from "@mui/icons-material/Description";
import FaceIcon from "@mui/icons-material/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";
import { Navigate } from 'react-router-dom';

import apiList from "../lib/apiList.js";
import isAuth from "../lib/isAuth";

// Styled components
const Body = styled(Paper)(({ theme }) => ({
  padding: "60px 60px",
}));

const InputBox = styled(TextField)(({ theme }) => ({
  width: "400px",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "400px",
}));

const MultifieldInput = ({ education, setEducation }) => (
  <>
    {education.map((obj, key) => (
      <Grid item container key={key} sx={{ paddingLeft: 0, paddingRight: 0 }}>
        <Grid item xs={3}>
          <TextField
            label={`Institution Name #${key + 1}`}
            value={education[key].institutionName}
            onChange={(event) => {
              const newEdu = [...education];
              newEdu[key].institutionName = event.target.value;
              setEducation(newEdu);
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Degree"
            value={obj.degree}
            variant="outlined"
            onChange={(event) => {
              const newEdu = [...education];
              newEdu[key].degree = event.target.value;
              setEducation(newEdu);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Start Year"
            value={obj.startYear}
            variant="outlined"
            type="number"
            onChange={(event) => {
              const newEdu = [...education];
              newEdu[key].startYear = event.target.value;
              setEducation(newEdu);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="End Year"
            value={obj.endYear}
            variant="outlined"
            type="number"
            onChange={(event) => {
              const newEdu = [...education];
              newEdu[key].endYear = event.target.value;
              setEducation(newEdu);
            }}
          />
        </Grid>
      </Grid>
    ))}
    <Grid item>
      <Button
        variant="contained"
        color="secondary"
        onClick={() =>
          setEducation([
            ...education,
            {
              institutionName: "",
              degree: "",
              startYear: "",
              endYear: "",
            },
          ])
        }
        sx={{ width: "400px" }}
      >
        Add another institution details
      </Button>
    </Grid>
  </>
);

const Login = () => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    role: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    companyName: "", // Changed from bio to companyName
    contact: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      degree: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contact: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contact: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const [chips, setChips] = useState(signupDetails.skills);

  const handleChipAdd = (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      setChips((prevChips) => [...prevChips, event.target.value.trim()]);
      handleInput("skills", [...chips, event.target.value.trim()]);
      event.target.value = "";
    }
  };

  const handleChipDelete = (chipToDelete) => {
    setChips((chips) => chips.filter((chip) => chip !== chipToDelete));
    handleInput("skills", chips.filter((chip) => chip !== chipToDelete));
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <Body elevation={3}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2">
            Signup
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Category"
            variant="outlined"
            sx={{ width: "400px" }}
            value={signupDetails.role}
            onChange={(event) => {
              handleInput("role", event.target.value);
            }}
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Name"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            sx={{ width: "400px" }}
            error={inputErrorHandler.name.error}
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Name is required");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            sx={{ width: "400px" }}
            required={true}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Password"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            sx={{ width: "400px" }}
            error={inputErrorHandler.password.error}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Password is required");
              } else {
                handleInputError("password", false, "");
              }
            }}
          />
        </Grid>
        {signupDetails.role === "applicant" ? (
          <>
            <MultifieldInput
              education={education}
              setEducation={setEducation}
            />
            <Grid item>
              <TextField
                label="Skills"
                variant="outlined"
                sx={{ width: "400px" }}
                placeholder="Press enter to add skills"
                onKeyDown={handleChipAdd}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {chips.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    onDelete={() => handleChipDelete(chip)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item>
              <FileUploadInput
                sx={{ width: "400px" }}
                label="Resume (.pdf)"
                icon={<DescriptionIcon />}
                onChange={(event) => handleInput("resume", event.target.value)}
                uploadTo={apiList.uploadResume}
                handleInput={handleInput}
                identifier={"resume"}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item>
              <TextField
                label="Company Name" // Changed from Bio to Company Name
                value={signupDetails.companyName}
                onChange={(event) => handleInput("companyName", event.target.value)}
                sx={{ width: "400px" }}
                error={inputErrorHandler.companyName?.error}
                helperText={inputErrorHandler.companyName?.message}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <SubmitButton
            variant="contained"
            color="primary"
            onClick={() => {
              signupDetails.role === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
          >
            Signup
          </SubmitButton>
        </Grid>
      </Grid>
    </Body>
  );
};

export default Login;
