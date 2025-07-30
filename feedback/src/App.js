// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';

// import Login from './pages/Login';
// import AdminLayout from './components/layout/Layout';
// import Dashboard from './pages/Home';
// import Feedback from './pages/Feedback';
// import SiteMaster from './pages/SiteMaster';
// import UserMaster from './pages/admin/UserManagement';
// import CustomerFeedback from './pages/feedbackform';
// // import other pages when ready

// function App() {
//   const { token, user } = useAuth();

//   if (!token || !user.role || !user.name) {
//     return <Login />;
//   }

//   const userRole = user?.role || '';
//   const userName = user?.name || '';

//   return (
//     <>
//       <Routes>
//         <Route path="/form" element={<CustomerFeedback />} />
//       </Routes>
//       <AdminLayout userRole={userRole} userName={userName}>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/feedback" element={<Feedback />} />
//           <Route path="/sitemaster" element={<SiteMaster />} />
//           <Route path="/users" element={<UserMaster />} />
//           {/* Add other routes when needed */}
//         </Routes>
//       </AdminLayout>
//     </>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Login from './pages/Login';
import AdminLayout from './components/layout/Layout';
import Dashboard from './pages/Home';
import Feedback from './pages/Feedback';
import SiteMaster from './pages/admin/SiteMaster';
import UserMaster from './pages/admin/UserManagement';
import CustomerFeedback from './pages/feedbackform';
import ProtectedRoute from './hooks/Protected';

import QuestionSelector from './pages/manager/SiteQuestions';

// Restricted Pages
import NotFound from './pages/NotFound'; 
import Unauthorized from './pages/Unauthorized';
import ChecklistForm from './pages/CheckList';

function App() {
  const { token, user } = useAuth();
  const isAuthenticated = token && user?.role && user?.name;

  return (
    <Routes>
      {/* Public route */}
      <Route path="/form" element={<CustomerFeedback />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path='/checklist' element={<ChecklistForm />} />

      {/* Authenticated routes */}
      {isAuthenticated ? (
        <Route element={<AdminLayout userRole={user.role} userName={user.name} />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Routes accessible to all authenticated users */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path='/questions' element={<QuestionSelector userRole={user.role}/>} />

          {/* Role-protected routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} userRole={user.role} />}>
            <Route path="/sitemaster" element={<SiteMaster />} />
            <Route path="/users" element={<UserMaster />} />
          </Route>

          {/* Fallback for authenticated users */}
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route path="*" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;


