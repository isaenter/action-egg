import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@arco-design/web-react/dist/css/arco.css';
import 'handsontable/dist/handsontable.full.min.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import AttendanceReport from './pages/AttendanceReport';
import AttendanceAnalysis from './pages/AttendanceAnalysis';
import LeaveManagement from './pages/LeaveManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/schedule" element={<ScheduleManagement />} />
          <Route path="/attendance-report" element={<AttendanceReport />} />
          <Route path="/attendance-analysis" element={<AttendanceAnalysis />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
