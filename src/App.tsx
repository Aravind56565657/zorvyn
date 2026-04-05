import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { BalanceTrendChart } from './components/BalanceTrendChart';
import { SpendingPieChart } from './components/SpendingPieChart';
import { InsightsSection } from './components/InsightsSection';
import { TransactionsTable } from './components/TransactionsTable';
import { AddTransactionModal } from './components/AddTransactionModal';

function App() {
  return (
    <div className="min-h-screen bg-transparent pb-20">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-[1400px]">
        <div className="flex flex-col mb-8">
          <h2 className="font-bricolage text-3xl font-bold text-text1 dark:text-[#F3F4F6]">Financial Overview</h2>
          <p className="text-sm text-text2 dark:text-[#9CA3AF] mt-1">Track your income, expenses, and savings seamlessly.</p>
        </div>

        <div id="overview" className="scroll-mt-24 mb-8 pt-4">
          <SummaryCards />
        </div>

        <div id="insights" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 pt-4">
          <div className="lg:col-span-2">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-1">
            <SpendingPieChart />
          </div>
        </div>

        <div id="reports" className="scroll-mt-24 mb-8 pt-4">
          <InsightsSection />
        </div>

        <div id="transactions" className="scroll-mt-24 pt-4">
          <TransactionsTable />
        </div>
      </main>

      <AddTransactionModal />
    </div>
  );
}

export default App;
