import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

// A component that guides new users through the application dashboard.
const AppTour = () => {
  const { user, completeOnboarding } = useAuth();
  const location = useLocation();
  const [run, setRun] = useState(false);

  // Only run on the dashboard for now, using persistent backend status
  useEffect(() => {
    if (!user) return;

    // Use the persistent hasSeenTour status from the user profile instead of localStorage
    if (!user.hasSeenTour && location.pathname === '/dashboard') {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user?.hasSeenTour, location.pathname]);

  const steps = React.useMemo(
    () => [
      {
        target: '#kpi-cards',
        content: 'Track your overall progress here.',
        disableBeacon: true,
      },
      {
        target: '#new-project-btn',
        content: 'Start by creating your first project.',
      },
      {
        target: '#portfolio-nav-link',
        content: 'Click here to see AI recommendations.',
      },
    ],
    []
  );

  // Handles the completion or skipping of the user onboarding tour.
  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      if (user && !user.hasSeenTour) {
        // Update persistent status on the server
        try {
          await completeOnboarding();
        } catch (err) {
          console.error('Failed to persist onboarding status');
        }
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: '#1E293B',
          backgroundColor: '#1E293B',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          primaryColor: '#3B82F6',
          textColor: '#ffffff',
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3B82F6',
          borderRadius: '8px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: '#94A3B8',
        },
        buttonSkip: {
          color: '#94A3B8',
        },
      }}
    />
  );
};

export default AppTour;
