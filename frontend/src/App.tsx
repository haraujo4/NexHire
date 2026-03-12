import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { CompanyLayout } from "./layouts/CompanyLayout"
import { CandidateLayout } from "./layouts/CandidateLayout"
import { Dashboard } from "./pages/company/Dashboard"
import { JobList } from "./pages/company/JobList"
import { JobForm } from "./pages/company/JobForm"
import { CandidateList } from "./pages/company/CandidateList"
import { Jobs } from "./pages/candidate/Jobs"
import { Applications } from "./pages/candidate/Applications"
import { Profile } from "./pages/candidate/Profile"
import { CompanyLogin } from "./pages/auth/CompanyLogin"
import { CompanyRegister } from "./pages/auth/CompanyRegister"
import { CandidateLogin } from "./pages/auth/CandidateLogin"
import { CandidateRegister } from "./pages/auth/CandidateRegister"
import { Home } from "./pages/Home"
import { AllApplications } from "./pages/company/AllApplications"
import { CompanyProfile } from "./pages/company/CompanyProfile"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ErrorPage } from "./pages/ErrorPage"
import DigitalCV from "./pages/company/DigitalCV"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth/company/login" element={<CompanyLogin />} />
        <Route path="/auth/company/register" element={<CompanyRegister />} />
        <Route path="/auth/candidate/login" element={<CandidateLogin />} />
        <Route path="/auth/candidate/register" element={<CandidateRegister />} />

        {/* Company Routes */}
        <Route element={<ProtectedRoute allowedRole="company" />}>
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<JobList />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/:id/edit" element={<JobForm />} />
            <Route path="jobs/:id/candidates" element={<CandidateList />} />
            <Route path="cv/:id" element={<DigitalCV />} />
            <Route path="candidates" element={<AllApplications />} />
            <Route path="profile" element={<CompanyProfile />} />
          </Route>
        </Route>

        {/* Candidate Routes */}
        <Route element={<ProtectedRoute allowedRole="candidate" />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<Navigate to="jobs" replace />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default App
