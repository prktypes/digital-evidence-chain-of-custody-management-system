import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    API.get("/evidence/all").then((res) => {
      console.log(res.data); // 👈 DEBUG
      setData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={fetchData}>Refresh</button> {/* 👈 ADD THIS */}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>File</th>
            <th>Hash</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.file_name}</td>
              <td>{e.file_hash}</td>
              <td>{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;