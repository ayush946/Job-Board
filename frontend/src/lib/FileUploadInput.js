import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Axios from "axios";

import { SetPopupContext } from "../App";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);

  const { uploadTo, identifier, handleInput, icon, label, className } = props;

  const [file, setFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = () => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
      },
    })
      .then((response) => {
        handleInput(identifier, response.data.url);
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
          message: err.response?.data?.message || err.response?.statusText || "Upload failed",
        });
      });
  };

  return (
    <Grid container item xs={12} direction="column" className={className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {icon || <CloudUpload />}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                setUploadPercentage(0);
                setFile(event.target.files[0]);
              }}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={label}
            value={file ? file.name : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", height: "100%" }}
            onClick={handleUpload}
            disabled={!file}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>
      {uploadPercentage > 0 && (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      )}
    </Grid>
  );
};

export default FileUploadInput;
