// @ts-nocheck
import React from 'react';
// @ts-ignore
import { Joyride, Step } from 'react-joyride';
import { useFinanceStore } from '../store/useFinanceStore';

export const GuidedTour: React.FC = () => {
  const { hasSeenTour, completeTour, theme } = useFinanceStore();

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to FinFlow',
      content: 'Experience a next-generation financial analytics engine. This brief 5-step masterclass will reveal the architectural depth of your new dashboard.',
    },
    {
      target: '#tour-auth-toggle',
      title: 'Dynamic RBAC System',
      content: 'Our core architecture supports high-fidelity Role-Based Access Control. While initially in "Viewer" mode, you can authenticate as an Admin using "admin123" to unlock full cryptographic write-access and CRUD operations.',
      placement: 'bottom',
    },
    {
      target: '#tour-trends',
      title: 'Volumetric Analytics',
      content: 'These charts leverage custom SVG injection filters to render 3D volumetric data. It provides depth and clarity to your financial trends without the overhead of heavy 3D libraries.',
      placement: 'bottom',
    },
    {
      target: '#tour-ledger',
      title: 'Distributed State Ledger',
      content: 'All transactions are managed via a centralized Zustand store with persistent LocalStorage caching. This ensures your financial data remains deterministic and synchronized across session restarts.',
      placement: 'top',
    },
    {
      target: '#tour-export',
      title: 'Data Extraction Engine',
      content: 'Maintain total data sovereignty. Our extraction pulse allowed you to buffer and download your entire ledger in industry-standard CSV or raw JSON formats with a single click.',
      placement: 'left',
    }
  ];

  const JoyrideComponent = Joyride as any;

  return (
    <JoyrideComponent
      steps={steps}
      run={!hasSeenTour}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      disableScrolling={false}
      callback={(data: any) => {
        const { status } = data;
        if (status === 'finished' || status === 'skipped') {
          completeTour();
        }
      }}
      styles={{
        options: {
          backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          textColor: theme === 'dark' ? '#F3F4F6' : '#1A1D2E',
          primaryColor: '#5B6AF0', // Periwinkle Brand Color
          arrowColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
          overlayColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        },
        tooltipTitle: {
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: '20px',
          fontWeight: 800,
          marginBottom: '10px',
          color: '#5B6AF0',
          letterSpacing: '-0.02em',
        },
        tooltipContent: {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          lineHeight: '1.6',
          color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
          padding: '0',
        },
        buttonNext: {
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '14px',
          backgroundColor: '#5B6AF0',
        },
        buttonBack: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          marginRight: '12px',
        },
        buttonSkip: {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: theme === 'dark' ? '#64748B' : '#94A3B8',
        }
      } as any}
    />
  );
};
