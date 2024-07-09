import { useContext, useState } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom"; 

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import { styled } from "@mui/system";

const Body = styled(Paper)(({ theme }) => ({
  padding: "60px 60px",
}));

const InputBox = styled(TextField)(({ theme }) => ({
  width: "300px",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "300px",
}));

const Login = () => {
  const navigate = useNavigate(); // Updated from useHistory
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          navigate("/"); // Updated from <Redirect>
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Navigate to="/" /> // Updated from <Redirect>
  ) : (
    <Body elevation={3}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2">
            Login
          </Typography>
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={loginDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            component={InputBox}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Password"
            value={loginDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            component={InputBox}
          />
        </Grid>
        <Grid item>
          <SubmitButton
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </SubmitButton>
        </Grid>
      </Grid>
    </Body>
  );
};

export default Login;
