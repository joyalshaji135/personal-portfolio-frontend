import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { setUserFromStorage } from "./store/slices/authSlice";
import { useAuth } from "./hooks/useAuth";

// Components
import Portfolio from "./pages/Portfolio";
import LoadingScreen from "./components/LoadingScreen";
import { Analytics } from "@vercel/analytics/react";
import Login from "./components/Admin/Login";
import AdminLayout from "./components/Admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionExpiryHandler from "./components/Admin//SessionExpiryHandler";

// Dashboard
import Dashboard from "./components/Admin/Dashboard";

import AboutAll from "./components/Admin/About/AboutAll";
import AboutAdd from "./components/Admin/About/AboutAdd";
import AboutEdit from "./components/Admin/About/AboutEdit";
import AboutView from "./components/Admin/About/AboutView";

import ContactAll from "./components/Admin/Contact/ContactAll";
import ContactAdd from "./components/Admin/Contact/ContactAdd";
import ContactEdit from "./components/Admin/Contact/ContactEdit";
import ContactView from "./components/Admin/Contact/ContactView";

import EducationAll from "./components/Admin/Education/EducationAll";
import EducationAdd from "./components/Admin/Education/EducationAdd";
import EducationEdit from "./components/Admin/Education/EducationEdit";
import EducationView from "./components/Admin/Education/EducationView";

import ExperienceAll from "./components/Admin/Experience/ExperienceAll";
import ExperienceAdd from "./components/Admin/Experience/ExperienceAdd";
import ExperienceEdit from "./components/Admin/Experience/ExperienceEdit";
import ExperienceView from "./components/Admin/Experience/ExperienceView";

import StackAll from "./components/Admin/Stack/StackAll";
import StackAdd from "./components/Admin/Stack/StackAdd";
import StackEdit from "./components/Admin/Stack/StackEdit";
import StackView from "./components/Admin/Stack/StackView";

import RoleAll from "./components/Admin/Profile/Role/RoleAll";
import RoleAdd from "./components/Admin/Profile/Role/RoleAdd";
import RoleEdit from "./components/Admin/Profile/Role/RoleEdit";
import RoleView from "./components/Admin/Profile/Role/RoleView";

import PortfolioAll from "./components/Admin/Portfolio/PortfolioAll";
import PortfolioAdd from "./components/Admin/Portfolio/PortfolioAdd";
import PortfolioEdit from "./components/Admin/Portfolio/PortfolioEdit";
import PortfolioView from "./components/Admin/Portfolio/PortfolioView";

import CategoryAll from "./components/Admin/Category/CategoryAll";
import CategoryAdd from "./components/Admin/Category/CategoryAdd";
import CategoryEdit from "./components/Admin/Category/CategoryEdit";
import CategoryView from "./components/Admin/Category/CategoryView";

import ProjectAll from "./components/Admin/Project/ProjectAll";
import ProjectAdd from "./components/Admin/Project/ProjectAdd";
import ProjectEdit from "./components/Admin/Project/ProjectEdit";
import ProjectView from "./components/Admin/Project/ProjectView";

import UserMessagesAll from './components/Admin/UserMessages/UserMessagesAll';
import UserMessagesView from './components/Admin/UserMessages/UserMessagesView';

import DevDoc from './pages/DevDoc';
import AuthCallback from './pages/AuthCallback';

import { ThemeProvider } from "./context/ThemeContext";

// App initialization component
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return children;
};

// Main App Content
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Session Expiry Handler */}
      <SessionExpiryHandler />

      {/* Routes */}
      {!isLoading && (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/dev-doc" element={<DevDoc />} />
          <Route path="/admin/login" element={<Login />} />
          
          {/* OAuth Callback Routes - IMPORTANT: These must be before protected routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/error" element={<AuthCallback />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* About Module */}
            <Route path="about" element={<AboutAll />} />
            <Route path="about/add" element={<AboutAdd />} />
            <Route path="about/edit/:id" element={<AboutEdit />} />
            <Route path="about/view/:id" element={<AboutView />} />

            {/* Project Module */}
            <Route path="projects" element={<ProjectAll />} />
            <Route path="projects/add" element={<ProjectAdd />} />
            <Route path="projects/edit/:id" element={<ProjectEdit />} />
            <Route path="projects/view/:id" element={<ProjectView />} />

            {/* Education Module */}
            <Route path="education" element={<EducationAll />} />
            <Route path="education/add" element={<EducationAdd />} />
            <Route path="education/edit/:id" element={<EducationEdit />} />
            <Route path="education/view/:id" element={<EducationView />} />

            {/* Experience Module */}
            <Route path="experience" element={<ExperienceAll />} />
            <Route path="experience/add" element={<ExperienceAdd />} />
            <Route path="experience/edit/:id" element={<ExperienceEdit />} />
            <Route path="experience/view/:id" element={<ExperienceView />} />

            {/* Stack Module */}
            <Route path="stack" element={<StackAll />} />
            <Route path="stack/add" element={<StackAdd />} />
            <Route path="stack/edit/:id" element={<StackEdit />} />
            <Route path="stack/view/:id" element={<StackView />} />

            {/* Contact Module */}
            <Route path="contact" element={<ContactAll />} />
            <Route path="contact/add" element={<ContactAdd />} />
            <Route path="contact/edit/:id" element={<ContactEdit />} />
            <Route path="contact/view/:id" element={<ContactView />} />

            {/* Role Module */}
            <Route path="role" element={<RoleAll />} />
            <Route path="role/add" element={<RoleAdd />} />
            <Route path="role/edit/:id" element={<RoleEdit />} />
            <Route path="role/view/:id" element={<RoleView />} />

            {/* Portfolio Module */}
            <Route path="portfolio" element={<PortfolioAll />} />
            <Route path="portfolio/add" element={<PortfolioAdd />} />
            <Route path="portfolio/edit/:id" element={<PortfolioEdit />} />
            <Route path="portfolio/view/:id" element={<PortfolioView />} />

            {/* Category Module */}
            <Route path="category" element={<CategoryAll />} />
            <Route path="category/add" element={<CategoryAdd />} />
            <Route path="category/edit/:id" element={<CategoryEdit />} />
            <Route path="category/view/:id" element={<CategoryView />} />

            {/* Project Module */}
            <Route path="project" element={<ProjectAll />} />
            <Route path="project/add" element={<ProjectAdd />} />
            <Route path="project/edit/:id" element={<ProjectEdit />} />
            <Route path="project/view/:id" element={<ProjectView />} />

            {/* User Messages Module */}
            <Route path="user-messages" element={<UserMessagesAll />} />
            <Route path="user-messages/view/:id" element={<UserMessagesView />} />
          </Route>

          {/* 404 - Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {/* Skip Intro Button */}
      {isLoading && (
        <button
          onClick={() => setIsLoading(false)}
          className="fixed top-6 right-6 z-50 px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-gray-400 text-sm rounded-lg border border-gray-700 hover:border-[#27CBCB] hover:text-[#27CBCB] transition-all duration-300"
        >
          Skip Intro
        </button>
      )}

      {/* Analytics */}
      <Analytics />
    </div>
  );
};

// Root App Component with all Providers
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Router>
            <AppInitializer>
              <AppContent />
            </AppInitializer>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;