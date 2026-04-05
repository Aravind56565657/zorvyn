import React from 'react';
// @ts-ignore
import Joyride, { Step } from 'react-joyride';
import { useFinanceStore } from '../store/useFinanceStore';

export const GuidedTour: React.FC = () => {
  const { hasSeenTour, completeTour, theme } = useFinanceStore();

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: 'Welcome to FinFlow! Let us take a quick 4-step system tour to help you understand the architectural features of this dashboard.',
    },
    {
      target: '#tour-auth-toggle',
      content: 'Role-Based Authentication: This dashboard features complex layout restructuring. You are initially a Viewer. Use "admin123" here to unlock full Layout/CRUD capabilities!',
      placement: 'bottom',
    },
    {
      target: '#tour-trends',
      content: 'Faux-3D Visualizations: These volumetric charts use custom SVG injection filters to render massive data arrays natively without heavy WebGL processing.',
      placement: 'bottom',
    },
    {
      target: '#tour-ledger',
      content: 'Dynamic Ledger: Admins have full CRUD payload mutation rights here. Data perfectly persists locally using Zustand to prove state management scaling.',
      placement: 'top',
    },
    {
      target: '#tour-export',
      content: 'Dual Extraction Engine: Instantly buffer what you see mapped in the table down into CSV spreadsheets or raw JSON outputs.',
      placement: 'left',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={!hasSeenTour}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={(data: any) => {
        const { status } = data;
        // status is 'finished' or 'skipped' when the tour completes
        if (status === 'finished' || status === 'skipped') {
          completeTour();
        }
      }}
      styles={{
        options: {
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          textColor: theme === 'dark' ? '#F3F4F6' : '#1A1D2E',
          primaryColor: '#16A34A',
          arrowColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          overlayColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
        },
        tooltipContainer: {
          textAlign: 'left',
          fontFamily: 'Outfit, sans-serif'
        },
        buttonNext: {
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 'bold',
          borderRadius: '8px'
        },
        buttonBack: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          fontFamily: 'Outfit, sans-serif'
        },
        buttonSkip: {
          fontFamily: 'Outfit, sans-serif'
        }
      }}
    />
  );
};
