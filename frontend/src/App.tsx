import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { CompanyLayout } from "./shared/layouts/CompanyLayout"
import { CandidateLayout } from "./shared/layouts/CandidateLayout"
import { ProtectedRoute } from "./shared/components/ProtectedRoute"

import { Dashboard } from "./features/dashboard/pages/Dashboard"
import { JobList } from "./features/jobs/pages/JobList"
import { JobForm } from "./features/jobs/pages/JobForm"
import { CandidateList } from "./features/applications/pages/CandidateList"
import { AllApplications } from "./features/applications/pages/AllApplications"
import { Jobs } from "./features/jobs/pages/Jobs"
import { Applications } from "./features/applications/pages/Applications"
import { Profile } from "./features/candidates/pages/Profile"
import { CompanyProfile } from "./features/candidates/pages/CompanyProfile"
import { CompanyLogin } from "./features/auth/pages/CompanyLogin"
import { CompanyRegister } from "./features/auth/pages/CompanyRegister"
import { CandidateLogin } from "./features/auth/pages/CandidateLogin"
import { CandidateRegister } from "./features/auth/pages/CandidateRegister"
import { Home } from "./pages/Home"
import { ErrorPage } from "./pages/ErrorPage"
import DigitalCV from "./features/candidates/pages/DigitalCV"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Home />} />

        
        <Route path="/auth/company/login" element={<CompanyLogin />} />
        <Route path="/auth/company/register" element={<CompanyRegister />} />
        <Route path="/auth/candidate/login" element={<CandidateLogin />} />
        <Route path="/auth/candidate/register" element={<CandidateRegister />} />

        
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
