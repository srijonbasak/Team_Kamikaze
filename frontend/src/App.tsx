import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import BlockerChat from './pages/BlockerChat';
import GuardianChat from './pages/GuardianChat';
import Docs from './pages/Docs';
import { ToastContainer, useToast } from './components/ui/Toast';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/blocker" element={<BlockerChat />} />
        <Route path="/guardian" element={<GuardianChat />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { toasts, removeToast } = useToast();

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col">
        <NavBar />
        <div className="flex-1">
          <AppRoutes />
        </div>
        <Footer />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </Router>
  );
}
