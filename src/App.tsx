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
import { getCurrentUser, signOut, getCompanyProfile } from '@/lib/storage';
import type { Job, Page, AppUser } from '@/types';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [prevPage, setPrevPage] = useState<Page>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
      setBooted(true);
    });
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

  const handleLoginSuccess = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setCurrentUser(user);
    if (user.role === 'empresa') {
      const profile = await getCompanyProfile(user.id);
      navigate(profile ? 'company-dashboard' : 'company-onboarding');
    } else {
      navigate('dashboard');
    }
  };

  const handleRegisterSuccess = (user: AppUser) => {
    setCurrentUser(user);
    if (user.role === 'empresa') {
      navigate('company-onboarding');
    } else {
      navigate('onboarding');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    navigate('landing');
  };

  const handleOnboardingComplete = () => navigate('dashboard');
  const handleCompanyOnboardingComplete = () => navigate('company-dashboard');
  const handleJobPublished = () => {
    setRefreshKey((k) => k + 1);
    navigate('company-dashboard');
  };

  const showHeader = page !== 'onboarding' && page !== 'company-onboarding';

  if (!booted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showHeader && (
        <Header
          currentPage={page}
          onNavigate={navigate}
          isLoggedIn={!!currentUser}
          userName={currentUser?.email}
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
            userName={currentUser.companyName || currentUser.email}
            onComplete={handleOnboardingComplete}
            onNavigate={navigate}
          />
        )}
        {page === 'company-onboarding' && currentUser && (
          <CompanyOnboardingPage
            userId={currentUser.id}
            companyName={currentUser.companyName || currentUser.email}
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
            companyName={currentUser.companyName || currentUser.email}
            onNavigate={navigate}
            onJobClick={handleJobClick}
            refreshKey={refreshKey}
          />
        )}
        {page === 'publish-job' && currentUser && (
          <PublishJobPage
            companyName={currentUser.companyName || currentUser.email}
            ownerId={currentUser.id}
            onPublished={handleJobPublished}
            onNavigate={navigate}
          />
        )}
      </main>
    </div>
  );
}
