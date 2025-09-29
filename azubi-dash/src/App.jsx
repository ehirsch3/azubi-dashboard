import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Verwaltung from "./Verwaltung";
import Home from "./Home";
import Kalender from "./Kalender";
import Navbar from "./components/Navbar";
import ClassManagement from "./ClassManagement";
import GradeEntry from "./GradeEntry";
import AdminGradeEntry from "./AdminGradeEntry";
import ReportManagement from "./ReportManagement";
import ReviewReports from "./ReviewReports";
import SubjectManagement from "./SubjectManagement";
import UnauthorizedPage from "./UnauthorizedPage";
import authUser from "./authUser";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/login", "/unauthorized"];
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch user data once the app starts
  React.useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await authUser(setUser);
      setLoading(false); // Finish loading after authentication
    };
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/unauthorized"
    ) {
      fetchUser();
    } else {
      setLoading(false); // Skip loading for login and unauthorized pages
    }
  }, [location.pathname]);

  // Skip loading on login and unauthorized pages
  if (
    loading &&
    location.pathname !== "/login" &&
    location.pathname !== "/unauthorized"
  ) {
    return <div>Loading...</div>; // Show loading state if still loading and not on login/unauthorized page
  }

  const AdminRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Show a loading message while waiting for user data
    }

    // Ensure only authenticated users can access protected routes
    switch (location.pathname) {
      case "/reports":
        return user && user.data.token ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/review-reports":
        return user && user.data.admin ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/verwaltung":
        return user && user.data.admin ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/class-management":
        return user && user.data.admin ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/home":
        return user && user.data.token ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/kalender":
        return user && user.data.token ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/kalenderuebersicht":
        return user && user.data.admin ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/notenuebersicht":
        return user && user.data.admin ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/grades":
        return user && user.data.token ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      case "/subjects":
        return user && user.data.token ? (
          children
        ) : (
          <Navigate to="/unauthorized" />
        );
      default:
        return <Navigate to="/unauthorized" />;
    }
  };

  return (
    <div className="wrapper">
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/verwaltung"
          element={
            <AdminRoute>
              <Verwaltung />
            </AdminRoute>
          }
        />
        <Route
          path="/class-management"
          element={
            <AdminRoute>
              <ClassManagement />
            </AdminRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route
          path="/kalender"
          element={
            <AdminRoute>
              <Kalender />
            </AdminRoute>
          }
        />
        <Route
          path="/notenuebersicht"
          element={
            <AdminRoute>
              <AdminGradeEntry />
            </AdminRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <AdminRoute>
              <GradeEntry />
            </AdminRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminRoute>
              <ReportManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/review-reports"
          element={
            <AdminRoute>
              <ReviewReports />
            </AdminRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <AdminRoute>
              <SubjectManagement />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
