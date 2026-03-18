import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import './index.css';
function App() {
  return (
    <div>
      <h1>Evidence Chain System</h1>
      <Upload />
      <Verify />
      <Dashboard />
    </div>
  );
}

export default App;