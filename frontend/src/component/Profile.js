import { useContext, useEffect, useState } from "react";
import {
    Button,
    Grid,
    Typography,
    Paper,
    TextField,
    Modal,
    Chip,
} from "@mui/material";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@mui/icons-material/Description";
import FaceIcon from "@mui/icons-material/Face";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { styled } from "@mui/system";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: "20px",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: "10px 50px",
    marginTop: "30px",
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const MultifieldInput = ({ education, setEducation }) => {
    return (
        <>
            {education.map((obj, key) => (
                <Grid item container key={key} spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label={`Institution Name #${key + 1}`}
                            value={education[key].institutionName}
                            onChange={(event) => {
                                const newEdu = [...education];
                                newEdu[key].institutionName = event.target.value;
                                setEducation(newEdu);
                            }}
                            variant="outlined"
                            fullWidth
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
            <Grid item style={{ alignSelf: "center" }}>
                <StyledButton
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
                >
                    Add another institution details
                </StyledButton>
            </Grid>
        </>
    );
};

const Profile = (props) => {
    const setPopup = useContext(SetPopupContext);
    const [userData, setUserData] = useState();
    const [open, setOpen] = useState(false);

    const [profileDetails, setProfileDetails] = useState({
        name: "",
        education: [],
        skills: [],
        resume: "",
        profile: "",
        contactNumber: "",
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

    const handleInput = (key, value) => {
        setProfileDetails({
            ...profileDetails,
            [key]: value,
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get(apiList.user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setProfileDetails(response.data);
                setPhone(response.data.contactNumber);
                if (response.data.education.length > 0) {
                    setEducation(
                        response.data.education.map((edu) => ({
                            institutionName: edu.institutionName ? edu.institutionName : "",
                            degree: edu.degree ? edu.degree : "",
                            startYear: edu.startYear ? edu.startYear : "",
                            endYear: edu.endYear ? edu.endYear : "",
                        }))
                    );
                }
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

    const handleClose = () => {
        setOpen(false);
    };

    const editDetails = () => {
        setOpen(true);
    };

    const handleUpdate = () => {
        console.log(education);

        let updatedDetails = {
            ...profileDetails,
            education: education
                .filter((obj) => obj.institutionName.trim() !== "")
                .map((obj) => {
                    if (obj["endYear"] === "") {
                        delete obj["endYear"];
                    }
                    return obj;
                }),
        };

        if (phone !== "") {
            updatedDetails.contactNumber = `+${phone}`;
        } else {
            updatedDetails.contactNumber = "";
        }

        axios
            .put(apiList.user, updatedDetails, {
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
            })
            .catch((err) => {
                setPopup({
                    open: true,
                    severity: "error",
                    message: err.response.data.message,
                });
                console.log(err.response);
            });
        setOpen(false);
    };

    return (
        <>
            <Grid
                container
                item
                direction="column"
                alignItems="center"
                style={{ padding: "30px", minHeight: "93vh" }}
            >
                <Grid item>
                    <Typography variant="h2">Profile</Typography>
                </Grid>
                <Grid item xs>
                    <StyledPaper>
                        <Grid container direction="column" alignItems="stretch" spacing={3}>
                            <Grid item>
                                <TextField
                                    label="Name"
                                    value={profileDetails.name}
                                    onChange={(event) => handleInput("name", event.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <MultifieldInput
                                education={education}
                                setEducation={setEducation}
                            />
                            <Grid item>
                                <Chip
                                    label="Skills"
                                    variant="outlined"
                                    // Helper text is not a valid prop for Chip, you'll need to manage this separately if needed
                                    // Implement chip input handling if required
                                    value={profileDetails.skills}
                                    onAdd={(chip) =>
                                        setProfileDetails({
                                            ...profileDetails,
                                            skills: [...profileDetails.skills, chip],
                                        })
                                    }
                                    onDelete={(chip, index) => {
                                        let skills = profileDetails.skills;
                                        skills.splice(index, 1);
                                        setProfileDetails({
                                            ...profileDetails,
                                            skills: skills,
                                        });
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <FileUploadInput
                                    label="Resume (.pdf)"
                                    icon={<DescriptionIcon />}
                                    uploadTo={apiList.uploadResume}
                                    handleInput={handleInput}
                                    identifier={"resume"}
                                />
                            </Grid>
                            <Grid
                                item
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <PhoneInput
                                    country={"in"}
                                    value={phone}
                                    onChange={(phone) => setPhone(phone)}
                                    style={{ width: "auto" }}
                                />
                            </Grid>
                        </Grid>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdate()}
                        >
                            Update Details
                        </StyledButton>
                    </StyledPaper>
                </Grid>
            </Grid>
            <Modal open={open} onClose={handleClose}>
                <div style={{ padding: 20, backgroundColor: 'white' }}>
                    {/* Modal content goes here */}
                </div>
            </Modal>
        </>
    );
};

export default Profile;
