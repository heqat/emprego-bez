import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import OnboardingPage from '@/pages/OnboardingPage';
import CompanyOnboardingPage from '@/pages/CompanyOnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CompanyDashboardPage from '@/pages/CompanyDashboardPage';
import PublishJobPage from '@/pages/PublishJobPage';
import { getSession, clearSession, getCompanyProfile } from '@/lib/storage';
import type { Job, Page, User } from '@/types';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [prevPage, setPrevPage] = useState<Page>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const session = getSession();
    if (session) setCurrentUser(session);
  }, []);

  const navigate = (target: Page) => {
    if (page !== 'job-detail') setPrevPage(page);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJobClick = (job: Job) => {
    setPrevPage(page);
    setSelectedJob(job);
    setPage('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userEmail: string) => {
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      if (session.role === 'company') {
        const hasProfile = !!getCompanyProfile(session.id);
        navigate(hasProfile ? 'company-dashboard' : 'company-onboarding');
      } else {
        navigate('dashboard');
      }
    }
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'company') {
      navigate('company-onboarding');
    } else {
      navigate('onboarding');
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    navigate('landing');
  };

  const handleOnboardingComplete = () => {
    navigate('dashboard');
  };

  const handleCompanyOnboardingComplete = () => {
    navigate('company-dashboard');
  };

  const handleJobPublished = () => {
    setRefreshKey((k) => k + 1);
    navigate('company-dashboard');
  };

  const showHeader = page !== 'onboarding' && page !== 'company-onboarding';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showHeader && (
        <Header
          currentPage={page}
          onNavigate={navigate}
          isLoggedIn={!!currentUser}
          userName={currentUser?.name}
          userRole={currentUser?.role}
          companyName={currentUser?.companyName}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        {page === 'landing' && (
          <LandingPage onNavigate={navigate} onJobClick={handleJobClick} />
        )}
        {page === 'login' && (
          <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />
        )}
        {page === 'register' && (
          <RegisterPage onNavigate={navigate} onRegisterSuccess={handleRegisterSuccess} />
        )}
        {page === 'onboarding' && currentUser && (
          <OnboardingPage
            userId={currentUser.id}
            userName={currentUser.name}
            onComplete={handleOnboardingComplete}
            onNavigate={navigate}
          />
        )}
        {page === 'company-onboarding' && currentUser && (
          <CompanyOnboardingPage
            userId={currentUser.id}
            companyName={currentUser.companyName || currentUser.name}
            onComplete={handleCompanyOnboardingComplete}
            onNavigate={navigate}
          />
        )}
        {page === 'dashboard' && (
          <DashboardPage
            isLoggedIn={!!currentUser}
            onJobClick={handleJobClick}
            onNavigate={navigate}
            refreshKey={refreshKey}
          />
        )}
        {page === 'job-detail' && selectedJob && (
          <JobDetailPage
            job={selectedJob}
            isLoggedIn={!!currentUser}
            onNavigate={navigate}
            onBack={() => {
              setPage(prevPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {page === 'company-dashboard' && currentUser && (
          <CompanyDashboardPage
            ownerId={currentUser.id}
            companyName={currentUser.companyName || currentUser.name}
            onNavigate={navigate}
            onJobClick={handleJobClick}
            refreshKey={refreshKey}
          />
        )}
        {page === 'publish-job' && currentUser && (
          <PublishJobPage
            companyName={currentUser.companyName || currentUser.name}
            companyAddress={getCompanyProfile(currentUser.id)?.address || ''}
            ownerId={currentUser.id}
            onPublished={handleJobPublished}
            onNavigate={navigate}
          />
        )}
      </main>
    </div>
  );
}
