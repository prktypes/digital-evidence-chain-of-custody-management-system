import { useState } from "react";
import API from "../api";

function Verify() {
  const [file, setFile] = useState(null);
  const [id, setId] = useState("");
  const [user, setUser] = useState("");

  const handleVerify = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("evidence_id", id);
    formData.append("user", user);

    const res = await API.post("/verify/verify", formData);
    alert(res.data.result);
  };

  return (
    <div>
      <h2>Verify</h2>
      <input placeholder="Evidence ID" onChange={(e) => setId(e.target.value)} />
      <input placeholder="User" onChange={(e) => setUser(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default Verify;  