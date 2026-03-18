import { useState } from "react";
import API from "../api";

function Upload() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user);

    await API.post("/evidence/upload", formData);
    alert("Uploaded!");
  };

  return (
    <div>
      <h2>Upload</h2>
      <input onChange={(e) => setUser(e.target.value)} placeholder="User" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;