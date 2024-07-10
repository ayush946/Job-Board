import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import { styled } from '@mui/system';

import Navbar from "./component/Navbar";
import Welcome, { ErrorPage } from "./component/Welcome";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Logout from "./component/Logout";
import Profile from "./component/Profile";
import RecruiterProfile from "./component/recruiter/Profile.js";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs"
import JobApplications from "./component/recruiter/JobApplications";
import { userType } from "./lib/isAuth";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants.js";

const Body = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "98vh",
  paddingTop: "64px",
  boxSizing: "border-box",
  width: "100%",
}));

export const SetPopupContext = createContext();

function App() {
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Body>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/Home" element={<Home />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<ErrorPage />} />
              {/* <Route path="/profile" element={<RecruiterProfile /> }/> */}
              <Route path="/profile" element={userType() === "recruiter" ? <RecruiterProfile /> : <Profile />} />
              <Route path="/addjobs" element={<CreateJobs />} />
              <Route path="/myjobs" element={<MyJobs />} />
              <Route path="/job/applications/:jobId" element={<JobApplications />} />
              <Route path="/employees" element={<AcceptedApplicants />} />
            </Routes>
          </Body>
        </Grid>
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
