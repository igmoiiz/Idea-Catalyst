import { useState } from 'react';

// --- IMPORTS ---
import Layout from './components/Layout';
import { authService } from './services/auth.service';

// Screen Imports
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import ExploreIdeas from './screens/ExploreIdeas';
import Features from './screens/Features';
import SubmitIdea from './screens/SubmitIdea';
import Marketplace from './screens/Marketplace';
import About from './screens/About';
import Personas from './screens/Personas';
import IdeaDetails from './screens/IdeaDetails';

// --- MAIN APP COMPONENT ---
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const handleNavigateA = (view: string) => {
    setCurrentView(view);
  };

  const handleViewIdeaDetails = (id: string) => {
    setSelectedIdeaId(id);
    setCurrentView('ideadetails');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleNavigateA('home');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    handleNavigateA('home');
  };

  return (
    <Layout onNavigate={handleNavigateA} isAuthenticated={isAuthenticated} onLogout={handleLogout}>

      {currentView === 'home' && <Home onNavigate={handleNavigateA} />}

      {currentView === 'signin' && <SignIn onNavigate={handleNavigateA} onLoginSuccess={handleLoginSuccess} />}

      {currentView === 'signup' && <SignUp onNavigate={handleNavigateA} onLoginSuccess={handleLoginSuccess} />}

      {currentView === 'submitidea' && <SubmitIdea onNavigate={handleNavigateA} onViewDetails={handleViewIdeaDetails} />}

      {currentView === 'explore' && <ExploreIdeas onNavigate={handleNavigateA} onViewDetails={handleViewIdeaDetails} />}

      {currentView === 'ideadetails' && selectedIdeaId && <IdeaDetails id={selectedIdeaId} onNavigate={handleNavigateA} />}

      {currentView === 'features' && <Features onNavigate={handleNavigateA} />}

      {currentView === 'marketplace' && <Marketplace onNavigate={handleNavigateA} onViewDetails={handleViewIdeaDetails} />}

      {currentView === 'personas' && <Personas onNavigate={handleNavigateA} isAuthenticated={isAuthenticated} />}

      {currentView === 'about' && <About onNavigate={handleNavigateA} />}

    </Layout>
  );
}

export default App;