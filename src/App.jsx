import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from './components/Layout';

// Import existing pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Templates from './pages/Templates';
import Tasks from './pages/Tasks';
import Phases from './pages/Phases';
import AgentStudio from './pages/AgentStudio';

// Import our enhanced pages for Aura Builder
import AuraBuilder from './pages/AuraBuilder';
import BuilderPreview from './pages/BuilderPreview';
import AuraTemplates from './pages/AuraTemplates';

function Fallback({ error }) {
  return <div className="p-6">حدث خطأ: {String(error)}</div>;
}

// Main App Component
export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/phases" element={<Phases />} />
            <Route path="/agent-studio" element={<AgentStudio />} />

            {/* Aura Builder routes */}
            <Route path="/aura-templates" element={<AuraTemplates />} />
            <Route path="/builder/:projectId" element={<AuraBuilder />} />
            <Route path="/preview/:projectId" element={<BuilderPreview />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
