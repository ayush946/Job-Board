import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = (location) => {
    navigate(location);
  };

  return (
    <Root>
      <AppBar position="fixed">
        <Toolbar>
          <Title variant="h6">
            Job Portal
          </Title>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <Button color="inherit" onClick={() => handleClick("/addjobs")}>
                  Add Jobs
                </Button>
                <Button color="inherit" onClick={() => handleClick("/myjobs")}>
                  My Jobs
                </Button>
                {/* <Button color="inherit" onClick={() => handleClick("/profile")}>
                  Profile
                </Button> */}
                <Button color="inherit" onClick={() => handleClick("/logout")}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => handleClick("/home")}>
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleClick("/applications")}
                >
                  Applications
                </Button>
                {/* <Button color="inherit" onClick={() => handleClick("/profile")}>
                  Profile
                </Button> */}
                <Button color="inherit" onClick={() => handleClick("/logout")}>
                  Logout
                </Button>
              </>
            )
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => handleClick("/signup")}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Root>
  );
};

export default Navbar;
