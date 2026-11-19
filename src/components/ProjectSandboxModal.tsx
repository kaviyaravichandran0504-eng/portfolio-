import { useEffect, useMemo, useState } from 'react';
import { X, Download, Plus, Trash2, CheckCircle2, AlertTriangle, Code2, Play } from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolioData';

interface ProjectSandboxModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

const formatINR = (val: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val);

/* 1. GST Invoice Generator Interactive Demo */
function GstInvoiceDemo() {
  const [customerName, setCustomerName] = useState('Sri Lakshmi Traders, Vellore');
  const [supplyMode, setSupplyMode] = useState<'intra' | 'inter'>('intra');
  const [items, setItems] = useState([
    { id: 1, name: 'Thermal Receipt Printer', hsn: '8443', qty: 2, price: 4200, gst: 18 },
    { id: 2, name: 'Barcode Scanner USB', hsn: '8471', qty: 3, price: 1850, gst: 18 },
  ]);
  const [exportedNote, setExportedNote] = useState(false);

  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: 'POS Paper Rolls (Pack of 20)', hsn: '4820', qty: 4, price: 650, gst: 12 },
    ]);
  };

  const removeLineItem = (id: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const taxable = item.qty * item.price;
        const tax = taxable * (item.gst / 100);
        return {
          taxable: acc.taxable + taxable,
          tax: acc.tax + tax,
          grand: acc.grand + taxable + tax,
        };
      },
      { taxable: 0, tax: 0, grand: 0 }
    );
  }, [items]);

  const exportCsv = () => {
    const header = 'Item,HSN,Qty,Rate,GST%,Taxable,Tax,LineTotal\n';
    const rows = items
      .map((i) => {
        const taxable = i.qty * i.price;
        const tax = taxable * (i.gst / 100);
        return `"${i.name}",${i.hsn},${i.qty},${i.price},${i.gst}%,${taxable.toFixed(2)},${tax.toFixed(2)},${(taxable + tax).toFixed(2)}`;
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gst-invoice-ledger.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExportedNote(true);
    window.setTimeout(() => setExportedNote(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gst-customer" className="block text-xs text-slate-400 mb-1.5">
            Billed To (Buyer)
          </label>
          <input
            id="gst-customer"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#070B14] border border-slate-700 text-slate-100 focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <span className="block text-xs text-slate-400 mb-1.5">Place of Supply</span>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#070B14] border border-slate-800">
            <button
              type="button"
              onClick={() => setSupplyMode('intra')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                supplyMode === 'intra'
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Intra-State (CGST+SGST)
            </button>
            <button
              type="button"
              onClick={() => setSupplyMode('inter')}
              className={`py-1.5 px-2 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                supplyMode === 'inter'
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inter-State (IGST)
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#070B14] text-xs text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-medium">Item Description</th>
              <th className="py-2.5 px-3 font-medium">HSN</th>
              <th className="py-2.5 px-3 font-medium">Qty</th>
              <th className="py-2.5 px-3 font-medium">Rate (₹)</th>
              <th className="py-2.5 px-3 font-medium">GST</th>
              <th className="py-2.5 px-3 font-medium text-right">Amount</th>
              <th className="py-2.5 px-2 w-10" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {items.map((item) => {
              const lineTaxable = item.qty * item.price;
              const lineTotal = lineTaxable * (1 + item.gst / 100);
              return (
                <tr key={item.id} className="bg-[#0B111E]">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.name}
                      aria-label="Item name"
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x) => (x.id === item.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                      className="w-full min-w-[150px] bg-transparent text-slate-100 focus:outline-none border-b border-transparent focus:border-teal-400"
                    />
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums text-slate-400">{item.hsn}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      aria-label="Quantity"
                      value={item.qty}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x) =>
                            x.id === item.id ? { ...x, qty: Math.max(1, Number(e.target.value) || 1) } : x
                          )
                        )
                      }
                      className="w-14 px-2 py-1 rounded bg-[#070B14] border border-slate-700 font-mono tabular-nums text-slate-100"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={50}
                      step={50}
                      aria-label="Unit price"
                      value={item.price}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x) =>
                            x.id === item.id ? { ...x, price: Math.max(0, Number(e.target.value) || 0) } : x
                          )
                        )
                      }
                      className="w-24 px-2 py-1 rounded bg-[#070B14] border border-slate-700 font-mono tabular-nums text-slate-100"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      aria-label="GST rate"
                      value={item.gst}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x) => (x.id === item.id ? { ...x, gst: Number(e.target.value) } : x))
                        )
                      }
                      className="px-2 py-1 rounded bg-[#070B14] border border-slate-700 font-mono tabular-nums text-slate-100"
                    >
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-100">
                    {formatINR(lineTotal)}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      aria-label="Remove item"
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addLineItem}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 hover:border-teal-400 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Line Item</span>
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{exportedNote ? 'Exported CSV' : 'Export Ledger CSV'}</span>
          </button>
        </div>

        <div className="text-right space-y-1 text-sm">
          <div className="text-slate-400">
            Taxable Subtotal:{' '}
            <span className="font-mono tabular-nums text-slate-200">{formatINR(totals.taxable)}</span>
          </div>
          {supplyMode === 'intra' ? (
            <div className="text-slate-400">
              CGST + SGST:{' '}
              <span className="font-mono tabular-nums text-slate-200">
                {formatINR(totals.tax / 2)} + {formatINR(totals.tax / 2)}
              </span>
            </div>
          ) : (
            <div className="text-slate-400">
              IGST: <span className="font-mono tabular-nums text-slate-200">{formatINR(totals.tax)}</span>
            </div>
          )}
          <div className="text-base font-semibold text-teal-300 font-mono tabular-nums">
            Total Payable: {formatINR(totals.grand)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. Expense & Budget Tracker Interactive Demo */
function ExpenseBudgetDemo() {
  const [monthlyIncome, setMonthlyIncome] = useState(32000);
  const [categories, setCategories] = useState([
    { name: 'Rent & Utilities', budget: 11000, spent: 10800 },
    { name: 'Groceries & Food', budget: 6500, spent: 5900 },
    { name: 'Transport & Fuel', budget: 3500, spent: 3950 },
    { name: 'Learning & Books', budget: 2500, spent: 1800 },
  ]);
  const [selectedCat, setSelectedCat] = useState('Groceries & Food');
  const [addAmount, setAddAmount] = useState(450);

  const logExpense = () => {
    if (addAmount <= 0) return;
    setCategories((prev) =>
      prev.map((c) => (c.name === selectedCat ? { ...c, spent: c.spent + addAmount } : c))
    );
  };

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const projectedSavings = monthlyIncome - totalSpent;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#070B14] border border-slate-800">
        <div>
          <label htmlFor="budget-income" className="block text-xs text-slate-400 mb-1">
            Monthly Income (₹)
          </label>
          <input
            id="budget-income"
            type="number"
            step={1000}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Math.max(1000, Number(e.target.value) || 0))}
            className="w-full px-2.5 py-1.5 rounded bg-[#0B111E] border border-slate-700 font-mono tabular-nums text-sm text-slate-100"
          />
        </div>
        <div>
          <span className="block text-xs text-slate-400 mb-1">Total Spent</span>
          <p className="text-lg font-mono tabular-nums font-semibold text-amber-300">
            {formatINR(totalSpent)}
          </p>
        </div>
        <div>
          <span className="block text-xs text-slate-400 mb-1">Projected Net Savings</span>
          <p
            className={`text-lg font-mono tabular-nums font-semibold ${
              projectedSavings >= 0 ? 'text-teal-300' : 'text-rose-400'
            }`}
          >
            {formatINR(projectedSavings)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const pct = Math.round((cat.spent / cat.budget) * 100);
          const isOver = pct > 100;
          const isWarn = pct >= 85 && pct <= 100;
          return (
            <div key={cat.name} className="p-3 rounded-xl bg-[#070B14] border border-slate-800/90">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-slate-200">{cat.name}</span>
                <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
                  <span className="text-slate-400">
                    {formatINR(cat.spent)} / {formatINR(cat.budget)}
                  </span>
                  <span
                    className={`font-semibold ${
                      isOver ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-teal-400'
                    }`}
                  >
                    {pct}% {isOver ? '· Over Budget' : isWarn ? '· Near Limit' : '· On Track'}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-400' : 'bg-teal-400'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-slate-800">
        <div className="flex-1 min-w-[160px]">
          <label htmlFor="log-cat" className="block text-xs text-slate-400 mb-1">
            Category
          </label>
          <select
            id="log-cat"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#070B14] border border-slate-700 text-slate-100"
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label htmlFor="log-amt" className="block text-xs text-slate-400 mb-1">
            Amount (₹)
          </label>
          <input
            id="log-amt"
            type="number"
            step={50}
            value={addAmount}
            onChange={(e) => setAddAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#070B14] border border-slate-700 font-mono tabular-nums text-slate-100"
          />
        </div>
        <button
          type="button"
          onClick={logExpense}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors cursor-pointer whitespace-nowrap"
        >
          Log Expense
        </button>
      </div>
    </div>
  );
}

/* 3. Sales Analytics Dashboard Interactive Demo */
function SalesAnalyticsDemo() {
  const [region, setRegion] = useState<'All' | 'Vellore' | 'Chennai' | 'Coimbatore'>('All');

  const records = [
    { sku: 'Billing Thermal Kit', region: 'Vellore', revenue: 184000, cost: 118000, units: 42 },
    { sku: 'Retail POS Terminal', region: 'Chennai', revenue: 342000, cost: 229000, units: 38 },
    { sku: 'Barcode Label Printer', region: 'Coimbatore', revenue: 156000, cost: 98000, units: 31 },
    { sku: 'Smart Cash Drawer', region: 'Vellore', revenue: 94000, cost: 64000, units: 28 },
    { sku: 'Cloud ERP Annual Pack', region: 'Chennai', revenue: 215000, cost: 62000, units: 19 },
  ];

  const filtered = region === 'All' ? records : records.filter((r) => r.region === region);
  const totalRev = filtered.reduce((s, r) => s + r.revenue, 0);
  const totalCost = filtered.reduce((s, r) => s + r.cost, 0);
  const grossProfit = totalRev - totalCost;
  const margin = totalRev > 0 ? ((grossProfit / totalRev) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-400">Filter Branch Performance</span>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#070B14] border border-slate-800">
          {(['All', 'Vellore', 'Chennai', 'Coimbatore'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                region === r
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
          <span className="text-xs text-slate-400">Net Revenue</span>
          <p className="text-lg font-mono tabular-nums font-semibold text-slate-100 mt-1">
            {formatINR(totalRev)}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
          <span className="text-xs text-slate-400">Gross Profit</span>
          <p className="text-lg font-mono tabular-nums font-semibold text-teal-300 mt-1">
            {formatINR(grossProfit)}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
          <span className="text-xs text-slate-400">Gross Margin</span>
          <p className="text-lg font-mono tabular-nums font-semibold text-amber-300 mt-1">
            {margin}%
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#070B14] text-xs text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-medium">Product SKU</th>
              <th className="py-2.5 px-3 font-medium">Branch</th>
              <th className="py-2.5 px-3 font-medium text-right">Units</th>
              <th className="py-2.5 px-3 font-medium text-right">Revenue</th>
              <th className="py-2.5 px-3 font-medium text-right">Margin %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map((row) => {
              const rowMargin = (((row.revenue - row.cost) / row.revenue) * 100).toFixed(1);
              return (
                <tr key={row.sku} className="bg-[#0B111E]">
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{row.sku}</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.region}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                    {row.units}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-100">
                    {formatINR(row.revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-teal-300">
                    {rowMargin}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 4. Inventory & Stock Alerts Interactive Demo */
function InventoryAlertsDemo() {
  const [leadDays, setLeadDays] = useState(5);
  const [skus, setSkus] = useState([
    { id: 1, name: 'A4 Thermal Paper Carton', stock: 42, dailyBurn: 6, safety: 12, due: '₹14,200' },
    { id: 2, name: 'USB Receipt Printers', stock: 14, dailyBurn: 2.5, safety: 5, due: '₹0 (Paid)' },
    { id: 3, name: 'Packing Tape Heavy-Duty', stock: 19, dailyBurn: 4, safety: 10, due: '₹6,800' },
  ]);

  const simulateSalesDay = () => {
    setSkus((prev) =>
      prev.map((s) => ({
        ...s,
        stock: Math.max(0, Math.round(s.stock - s.dailyBurn)),
      }))
    );
  };

  const resetStock = () => {
    setSkus([
      { id: 1, name: 'A4 Thermal Paper Carton', stock: 42, dailyBurn: 6, safety: 12, due: '₹14,200' },
      { id: 2, name: 'USB Receipt Printers', stock: 14, dailyBurn: 2.5, safety: 5, due: '₹0 (Paid)' },
      { id: 3, name: 'Packing Tape Heavy-Duty', stock: 19, dailyBurn: 4, safety: 10, due: '₹6,800' },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#070B14] border border-slate-800">
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-xs mb-1.5">
            <label htmlFor="lead-days" className="text-slate-400">
              Supplier Lead Time
            </label>
            <span className="font-mono tabular-nums text-teal-300">{leadDays} Days</span>
          </div>
          <input
            id="lead-days"
            type="range"
            min={2}
            max={12}
            value={leadDays}
            onChange={(e) => setLeadDays(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={simulateSalesDay}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Simulate 1 Sales Day
          </button>
          <button
            type="button"
            onClick={resetStock}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Restock All
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {skus.map((sku) => {
          const reorderPoint = Math.round(sku.dailyBurn * leadDays) + sku.safety;
          const daysCover = (sku.stock / sku.dailyBurn).toFixed(1);
          const needsReorder = sku.stock <= reorderPoint;

          return (
            <div
              key={sku.id}
              className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[#070B14] border border-slate-800"
            >
              <div>
                <h4 className="text-sm font-medium text-slate-100">{sku.name}</h4>
                <p className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                  On hand: {sku.stock} units · Reorder Point: {reorderPoint} · Supplier Due: {sku.due}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                <span className="text-slate-300">{daysCover}d cover</span>
                {needsReorder ? (
                  <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                    Reorder Now
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-teal-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Healthy
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 5. OCR Receipt Reader Interactive Demo */
function OcrReaderDemo() {
  const samples = [
    {
      id: 'stationery',
      label: 'Vellore Paper Mart',
      rawText: `VELLORE PAPER MART PVT LTD\nGSTIN: 33AABCV4821K1Z5\nInv No: VPM-2026-0842   Date: 14-11-2026\nA4 Copier Reams x 4       680.00\nGST 12%                   81.60\nGrand Total: Rs. 761.60`,
      parsed: {
        vendor: 'Vellore Paper Mart Pvt Ltd',
        gstin: '33AABCV4821K1Z5',
        date: '2026-11-14',
        taxable: '₹680.00',
        tax: '₹81.60',
        total: '₹761.60',
      },
    },
    {
      id: 'logistics',
      label: 'Kaveri Freight Cargo',
      rawText: `KAVERI FREIGHT & LOGISTICS\nGSTIN: 33AAACK9120M1Z9\nBill #KFL-9910   Date: 17-11-2026\nChennai-Vellore Dispatch  2,400.00\nCGST 9% + SGST 9%         432.00\nTotal Payable: Rs. 2,832.00`,
      parsed: {
        vendor: 'Kaveri Freight & Logistics',
        gstin: '33AAACK9120M1Z9',
        date: '2026-11-17',
        taxable: '₹2,400.00',
        tax: '₹432.00',
        total: '₹2,832.00',
      },
    },
  ];

  const [selectedId, setSelectedId] = useState(samples[0].id);
  const current = samples.find((s) => s.id === selectedId) ?? samples[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {samples.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedId(s.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
              selectedId === s.id
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-200'
                : 'bg-[#070B14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800">
          <p className="text-xs font-medium text-slate-400 mb-2">Raw OCR Receipt Text</p>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {current.rawText}
          </pre>
        </div>

        <div className="p-4 rounded-xl bg-[#070B14] border border-teal-500/30">
          <p className="text-xs font-medium text-teal-400 mb-2">Extracted Accounting Record</p>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-400">Vendor</dt>
              <dd className="text-slate-100 font-medium">{current.parsed.vendor}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">GSTIN</dt>
              <dd className="font-mono tabular-nums text-slate-200">{current.parsed.gstin}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Date</dt>
              <dd className="font-mono tabular-nums text-slate-200">{current.parsed.date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Taxable Value</dt>
              <dd className="font-mono tabular-nums text-slate-200">{current.parsed.taxable}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">GST Tax</dt>
              <dd className="font-mono tabular-nums text-amber-300">{current.parsed.tax}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-semibold">
              <dt className="text-slate-200">Total Amount</dt>
              <dd className="font-mono tabular-nums text-teal-300">{current.parsed.total}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

/* 6. Loan EMI & Financial Ratio Calculator Interactive Demo */
function LoanRatioDemo() {
  const [principal, setPrincipal] = useState(600000);
  const [rate, setRate] = useState(11);
  const [months, setMonths] = useState(36);
  const [currentAssets, setCurrentAssets] = useState(850000);
  const [currentLiabilities, setCurrentLiabilities] = useState(400000);

  const monthlyRate = rate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalInterest = emi * months - principal;
  const currentRatio = currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : '0.00';

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="space-y-4 p-4 rounded-xl bg-[#070B14] border border-slate-800">
        <h4 className="text-xs font-medium text-teal-400">Business Loan Parameters</h4>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Loan Amount</span>
            <span className="font-mono tabular-nums text-slate-100">{formatINR(principal)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={2500000}
            step={50000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Interest Rate (p.a.)</span>
            <span className="font-mono tabular-nums text-slate-100">{rate}%</span>
          </div>
          <input
            type="range"
            min={6}
            max={22}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Tenure</span>
            <span className="font-mono tabular-nums text-slate-100">{months} Months</span>
          </div>
          <input
            type="range"
            min={12}
            max={60}
            step={6}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>
        <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
          <span className="text-xs text-slate-400">Monthly EMI / Total Interest</span>
          <span className="font-mono tabular-nums text-sm font-semibold text-teal-300">
            {formatINR(emi)} · {formatINR(totalInterest)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-[#070B14] border border-slate-800">
        <h4 className="text-xs font-medium text-amber-400">Liquidity Ratio Health</h4>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Current Assets</span>
            <span className="font-mono tabular-nums text-slate-100">{formatINR(currentAssets)}</span>
          </div>
          <input
            type="range"
            min={200000}
            max={2000000}
            step={50000}
            value={currentAssets}
            onChange={(e) => setCurrentAssets(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Current Liabilities</span>
            <span className="font-mono tabular-nums text-slate-100">
              {formatINR(currentLiabilities)}
            </span>
          </div>
          <input
            type="range"
            min={100000}
            max={1500000}
            step={50000}
            value={currentLiabilities}
            onChange={(e) => setCurrentLiabilities(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
        <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
          <span className="text-xs text-slate-400">Current Ratio (Benchmark &ge; 1.50x)</span>
          <span
            className={`font-mono tabular-nums text-lg font-semibold ${
              Number(currentRatio) >= 1.5 ? 'text-teal-300' : 'text-rose-400'
            }`}
          >
            {currentRatio}x
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectSandboxModal({ project, onClose }: ProjectSandboxModalProps) {
  const [mode, setMode] = useState<'demo' | 'architecture'>('demo');

  useEffect(() => {
    setMode('demo');
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060C]/88"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0B111E] border border-slate-800 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 bg-[#0B111E] border-b border-slate-800">
          <div>
            <p className="text-xs font-medium text-teal-400">
              {project.categoryLabel} · {project.stack.join(' / ')}
            </p>
            <h3 id="modal-project-title" className="text-xl font-bold text-slate-100 mt-1">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="inline-flex p-1 rounded-lg bg-[#070B14] border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('demo')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                mode === 'demo'
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Interactive Prototype</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('architecture')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                mode === 'architecture'
                  ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Case Study &amp; Logic</span>
            </button>
          </div>

          {mode === 'demo' ? (
            <div>
              {project.id === 'gst-invoice' && <GstInvoiceDemo />}
              {project.id === 'expense-budget' && <ExpenseBudgetDemo />}
              {project.id === 'sales-analytics' && <SalesAnalyticsDemo />}
              {project.id === 'inventory-alerts' && <InventoryAlertsDemo />}
              {project.id === 'ocr-reader' && <OcrReaderDemo />}
              {project.id === 'loan-emi-ratio' && <LoanRatioDemo />}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800">
                  <h4 className="text-xs font-semibold text-amber-400 mb-1.5">Business Problem</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{project.problem}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800">
                  <h4 className="text-xs font-semibold text-teal-400 mb-1.5">System Architecture</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{project.architecture}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800">
                  <h4 className="text-xs font-semibold text-sky-400 mb-1.5">Measured Outcome</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{project.outcome}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#070B14] border border-slate-800 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{project.codeLabel}</span>
                  <span className="text-xs font-mono text-slate-500">{project.stack.join(' · ')}</span>
                </div>
                <pre className="p-4 text-xs font-mono text-teal-200 overflow-x-auto leading-relaxed">
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
