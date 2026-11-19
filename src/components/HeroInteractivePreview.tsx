import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type WorkbenchTab = 'gst' | 'margin' | 'emi';

interface HeroInteractivePreviewProps {
  onOpenProject: (projectId: string) => void;
}

const formatINR = (val: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

export default function HeroInteractivePreview({ onOpenProject }: HeroInteractivePreviewProps) {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('gst');
  const [invoiceBase, setInvoiceBase] = useState(25000);
  const [gstSlab, setGstSlab] = useState<5 | 12 | 18 | 28>(18);
  const [intraState, setIntraState] = useState(true);

  const [revenue, setRevenue] = useState(480000);
  const [cogs, setCogs] = useState(312000);

  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(11.5);
  const [months, setMonths] = useState(24);

  const taxTotal = Math.round(invoiceBase * (gstSlab / 100));
  const cgst = intraState ? taxTotal / 2 : 0;
  const sgst = intraState ? taxTotal / 2 : 0;
  const igst = intraState ? 0 : taxTotal;
  const grandTotal = invoiceBase + taxTotal;

  const grossProfit = revenue - cogs;
  const marginPct = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0.0';

  const monthlyRate = rate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi =
    monthlyRate === 0
      ? principal / months
      : Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;

  const linkedProjectId =
    activeTab === 'gst'
      ? 'gst-invoice'
      : activeTab === 'margin'
      ? 'sales-analytics'
      : 'loan-emi-ratio';

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl bg-[#0B111E]/95 border border-slate-800/90 p-6 shadow-2xl shadow-black/50">
      <div>
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <p className="text-xs font-medium text-teal-400">Interactive Ledger Workbench</p>
            <h2 className="text-base font-semibold text-slate-100 mt-0.5">
              Live Commerce &amp; Formula Sandbox
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenProject(linkedProjectId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-300 border border-teal-500/30 rounded-lg hover:bg-teal-500/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Full Tool</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Interactive Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Formula workbench modes"
          className="grid grid-cols-3 gap-1 p-1 mt-4 rounded-lg bg-[#070B14] border border-slate-800/80"
        >
          {[
            { id: 'gst' as const, label: 'GST Tax Split' },
            { id: 'margin' as const, label: 'Gross Margin' },
            { id: 'emi' as const, label: 'Loan EMI' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Workbench Pane */}
        {activeTab === 'gst' && (
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="hero-taxable" className="text-slate-400">
                  Taxable Invoice Amount
                </label>
                <span className="font-mono tabular-nums text-slate-100 font-medium">
                  {formatINR(invoiceBase)}
                </span>
              </div>
              <input
                id="hero-taxable"
                type="range"
                min={5000}
                max={150000}
                step={2500}
                value={invoiceBase}
                onChange={(e) => setInvoiceBase(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {([5, 12, 18, 28] as const).map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setGstSlab(slab)}
                    className={`px-2.5 py-1.5 text-xs font-mono tabular-nums rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      gstSlab === slab
                        ? 'bg-teal-500/20 border-teal-400/50 text-teal-200'
                        : 'bg-[#070B14] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIntraState((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 text-slate-200 hover:border-amber-400/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {intraState ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>CGST ({intraState ? gstSlab / 2 : 0}%)</span>
                <span className="font-mono tabular-nums text-slate-200">{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST ({intraState ? gstSlab / 2 : 0}%)</span>
                <span className="font-mono tabular-nums text-slate-200">{formatINR(sgst)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>IGST ({intraState ? 0 : gstSlab}%)</span>
                <span className="font-mono tabular-nums text-slate-200">{formatINR(igst)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-800/80">
                <span className="text-xs font-medium text-amber-400">Invoice Grand Total</span>
                <span className="text-xl font-mono tabular-nums font-semibold text-teal-300">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'margin' && (
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="hero-rev" className="text-slate-400">
                  Monthly Net Revenue
                </label>
                <span className="font-mono tabular-nums text-slate-100 font-medium">
                  {formatINR(revenue)}
                </span>
              </div>
              <input
                id="hero-rev"
                type="range"
                min={100000}
                max={1200000}
                step={20000}
                value={revenue}
                onChange={(e) => {
                  const nextRev = Number(e.target.value);
                  setRevenue(nextRev);
                  if (cogs > nextRev) setCogs(Math.round(nextRev * 0.7));
                }}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="hero-cogs" className="text-slate-400">
                  Cost of Goods Sold (COGS)
                </label>
                <span className="font-mono tabular-nums text-slate-100 font-medium">
                  {formatINR(cogs)}
                </span>
              </div>
              <input
                id="hero-cogs"
                type="range"
                min={50000}
                max={revenue}
                step={10000}
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Gross Profit</span>
                <span className="font-mono tabular-nums text-slate-100">{formatINR(grossProfit)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 transition-all duration-200"
                  style={{ width: `${Math.min(100, Number(marginPct))}%` }}
                />
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-medium text-amber-400">DAX Gross Margin %</span>
                <span className="text-xl font-mono tabular-nums font-semibold text-teal-300">
                  {marginPct}%
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emi' && (
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="hero-principal" className="text-slate-400">
                  Working Capital Loan
                </label>
                <span className="font-mono tabular-nums text-slate-100 font-medium">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                id="hero-principal"
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label htmlFor="hero-rate" className="text-slate-400">
                    Rate p.a.
                  </label>
                  <span className="font-mono tabular-nums text-slate-200">{rate}%</span>
                </div>
                <input
                  id="hero-rate"
                  type="range"
                  min={7}
                  max={20}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label htmlFor="hero-months" className="text-slate-400">
                    Tenure
                  </label>
                  <span className="font-mono tabular-nums text-slate-200">{months} mo</span>
                </div>
                <input
                  id="hero-months"
                  type="range"
                  min={6}
                  max={60}
                  step={6}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Total Interest Outflow</span>
                <span className="font-mono tabular-nums text-amber-300">
                  {formatINR(totalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-medium text-amber-400">Monthly EMI</span>
                <span className="text-xl font-mono tabular-nums font-semibold text-teal-300">
                  {formatINR(emi)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono">
          {activeTab === 'gst'
            ? 'total = base + split_gst(slab)'
            : activeTab === 'margin'
            ? 'DIVIDE(Rev - COGS, Rev)'
            : 'EMI = P*r*(1+r)^n / ((1+r)^n - 1)'}
        </span>
        <span className="text-slate-500">Live JS Model</span>
      </div>
    </div>
  );
}
