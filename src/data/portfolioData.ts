export type ProjectCategory = 'all' | 'fintech' | 'analytics' | 'automation';

export interface ProjectCaseStudy {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  tagline: string;
  summary: string;
  problem: string;
  architecture: string;
  outcome: string;
  stack: string[];
  codeLabel: string;
  codeSnippet: string;
  accentHex: string;
  imageUrl: string;
  imageAlt: string;
  frontMetrics: { label: string; value: string }[];
}

export interface SkillGroup {
  title: string;
  subtitle: string;
  items: { name: string; detail: string }[];
}

export const PROFILE = {
  name: 'Kaviya',
  greeting: "Hello, I'm",
  degreeLine: 'BCA Graduate (Finance & Data)',
  location: 'Vellore, Tamil Nadu.',
  role: 'BCA Graduate · Finance & Data',
  email: 'kaviyaravichandran0504@gmail.com',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
  heroBio:
    'I have completed my Bachelor of Computer Applications (BCA) degree at Auxilium College (Autonomous), Vellore, building on a strong Commerce foundation (HSC 85%). Passionate about fintech and business data systems with hands-on experience in GST billing logic, SQL analytics, Excel financial modeling, Python automation, and Power BI reporting. Actively seeking entry-level roles in Fintech Operations, Business Analytics, ERP Support, or Finance Technology.',
  aboutSummary:
    'Having completed my BCA degree alongside a Higher Secondary Commerce track (85%), I bridge double-entry accounting accuracy and software engineering. Understanding GST tax rules, trial balances, and cashflow statements allows me to design reliable financial tools that eliminate manual reconciliation errors for businesses and finance teams.',
  targetRoles: [
    'Fintech Operations Analyst',
    'Business & Data Analyst',
    'ERP Implementation Support',
    'Finance Automation Associate',
  ],
};

export const KEY_METRICS = [
  { value: 'BCA', label: 'Auxilium College Graduate' },
  { value: '67.5%', label: 'BCA Aggregate Score' },
  { value: '85.0%', label: 'Higher Secondary (Commerce)' },
  { value: '6 Live', label: 'Interactive Finance Prototypes' },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Computer & Data',
    subtitle: 'Querying, scripting & BI reporting',
    items: [
      { name: 'SQL', detail: 'Joins, aggregations & ledger queries' },
      { name: 'Power BI', detail: 'DAX measures & margin dashboards' },
      { name: 'MS Excel', detail: 'Pivot tables, XLOOKUP & variance models' },
      { name: 'Python (Basics)', detail: 'Pandas data cleaning & PDF automation' },
      { name: 'MS Office', detail: 'Executive reporting & documentation' },
    ],
  },
  {
    title: 'Commerce & Finance',
    subtitle: 'Domain rules & statutory compliance',
    items: [
      { name: 'GST Fundamentals', detail: 'CGST / SGST / IGST & HSN classification' },
      { name: 'Invoicing Systems', detail: 'Taxable value, discounts & round-off logic' },
      { name: 'Financial Statements', detail: 'P&L, balance sheet & liquidity ratios' },
      { name: 'Commerce (HSC)', detail: 'Double-entry bookkeeping & cost accounting' },
    ],
  },
  {
    title: 'Tools & Workflow',
    subtitle: 'Accounting & version-controlled delivery',
    items: [
      { name: 'Tally', detail: 'Voucher entry, GST ledgers & trial balance' },
      { name: 'Google Sheets', detail: 'Collaborative trackers & AppScript basics' },
      { name: 'Git & GitHub', detail: 'Branching, commits & project documentation' },
    ],
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'gst-invoice',
    title: 'GST Invoice Generator',
    category: 'fintech',
    categoryLabel: 'Fintech & Compliance',
    tagline: 'Automated CGST/SGST/IGST billing with HSN validation and print-ready tax ledgers.',
    summary:
      'Generates GST-compliant tax invoices with automatic intra-state vs. inter-state tax splitting, HSN code line items, and structured CSV/PDF export for local retailers and freelancers.',
    problem:
      'Small shop owners frequently miscalculate intra-state CGST/SGST splits versus inter-state IGST in manual spreadsheets, leading to GST return mismatches.',
    architecture:
      'Relational SQLite schema storing vendor GSTIN, HSN tax slabs (5%, 12%, 18%, 28%), and line-item totals, paired with a deterministic tax engine and PDF generator.',
    outcome:
      'Eliminates manual tax rounding errors and produces audit-ready invoices in under 15 seconds.',
    stack: ['Python', 'SQLite', 'PDF Export'],
    accentHex: '#14B8A6',
    imageUrl: '/src/assets/images/project_gst_invoice_1795102182695.jpg',
    imageAlt: 'Tablet displaying tax invoice ledger next to thermal receipt printer on dark desk',
    frontMetrics: [
      { label: 'Tax Slabs', value: '5–28% GST' },
      { label: 'Output', value: 'CSV & PDF' },
    ],
    codeLabel: 'Tax Split Engine (Python)',
    codeSnippet: `def compute_gst_line(qty: int, rate: float, gst_pct: float, intra_state: bool):
    taxable = round(qty * rate, 2)
    total_tax = round(taxable * (gst_pct / 100), 2)
    if intra_state:
        half = round(total_tax / 2, 2)
        return {"taxable": taxable, "cgst": half, "sgst": half, "igst": 0.0}
    return {"taxable": taxable, "cgst": 0.0, "sgst": 0.0, "igst": total_tax}`,
  },
  {
    id: 'expense-budget',
    title: 'Expense & Budget Tracker',
    category: 'analytics',
    categoryLabel: 'Personal & Household Finance',
    tagline: 'Category variance monitoring with real-time overspend threshold alerts.',
    summary:
      'Tracks monthly income and category-level spending, flags budget overruns at 85% and 100% thresholds, and visualizes savings runway for students and families.',
    problem:
      'Raw bank statements lack category budgets, making it difficult to spot recurring discretionary leaks before month-end.',
    architecture:
      'Normalized SQL transaction ledger feeding Excel pivot summaries and Power BI variance bars comparing planned allocation against actual cash outflow.',
    outcome:
      'Surfaces top variance drivers immediately and projects end-of-month net savings.',
    stack: ['Excel', 'Power BI', 'SQL'],
    accentHex: '#F59E0B',
    imageUrl: '/src/assets/images/project_expense_budget_1795102184954.jpg',
    imageAlt: 'Laptop showing monthly budget allocation and cashflow breakdown beside ledger notebook',
    frontMetrics: [
      { label: 'Alert Gate', value: '85% / 100%' },
      { label: 'Model', value: 'SQL + BI' },
    ],
    codeLabel: 'Variance Alert Query (SQL)',
    codeSnippet: `SELECT
  c.category_name,
  c.monthly_budget,
  COALESCE(SUM(t.amount), 0) AS spent,
  ROUND((COALESCE(SUM(t.amount), 0) / c.monthly_budget) * 100, 1) AS utilization_pct
FROM budget_categories c
LEFT JOIN transactions t ON t.category_id = c.id
GROUP BY c.id
ORDER BY utilization_pct DESC;`,
  },
  {
    id: 'sales-analytics',
    title: 'Sales Analytics Dashboard',
    category: 'analytics',
    categoryLabel: 'Retail Data Analytics',
    tagline: 'Regional revenue, gross margin, and top-SKU visibility for retail owners.',
    summary:
      'Transforms daily POS export CSVs into an interactive executive view of regional revenue, product margin contribution, and quarterly growth trends.',
    problem:
      'Shop owners track total daily cash but rarely see which SKUs generate high revenue at razor-thin margins versus high-profit stock.',
    architecture:
      'Star-schema sales model in SQL with DAX measures for Gross Margin %, YoY Variance, and Regional Contribution across Tamil Nadu retail hubs.',
    outcome:
      'Highlights high-margin product lines and underperforming branches within a single filterable view.',
    stack: ['Power BI', 'SQL', 'DAX'],
    accentHex: '#38BDF8',
    imageUrl: '/src/assets/images/project_sales_analytics_1795102183962.jpg',
    imageAlt: 'Studio monitor displaying retail sales performance bar charts and revenue growth curve',
    frontMetrics: [
      { label: 'Branches', value: '3 Cities' },
      { label: 'KPI', value: 'Gross Margin' },
    ],
    codeLabel: 'Gross Margin Measure (DAX)',
    codeSnippet: `Gross Margin % =
VAR TotalRev = SUM(Sales[NetRevenue])
VAR TotalCost = SUM(Sales[COGS])
RETURN
DIVIDE(TotalRev - TotalCost, TotalRev, 0)`,
  },
  {
    id: 'inventory-alerts',
    title: 'Inventory & Stock Alerts',
    category: 'automation',
    categoryLabel: 'Supply & Operations',
    tagline: 'Automated reorder-point tracking, days-of-cover estimation, and supplier dues.',
    summary:
      'Monitors live SKU quantities against safety-stock thresholds and supplier lead times, prioritizing purchase orders before stockouts occur.',
    problem:
      'Manual stock registers catch empty shelves only after a customer walks away, while vendor credit dues slip past payment terms.',
    architecture:
      'MySQL inventory ledger coupled with a Python daily burn-rate calculator computing Days of Cover = Current Stock / Avg Daily Sales.',
    outcome:
      'Flags critical SKUs ahead of supplier lead-time windows and tracks outstanding payables.',
    stack: ['Python', 'MySQL', 'Excel'],
    accentHex: '#A78BFA',
    imageUrl: '/src/assets/images/project_inventory_alerts_1795102184436.jpg',
    imageAlt: 'Warehouse shelving with barcode-labeled boxes and tablet stock alert monitor',
    frontMetrics: [
      { label: 'Trigger', value: 'Days Cover' },
      { label: 'Ledger', value: 'MySQL' },
    ],
    codeLabel: 'Reorder Priority Rule (Python)',
    codeSnippet: `def reorder_status(stock: int, daily_burn: float, lead_days: int, safety: int):
    reorder_point = round(daily_burn * lead_days) + safety
    days_cover = round(stock / max(daily_burn, 0.1), 1)
    status = "REORDER NOW" if stock <= reorder_point else "HEALTHY"
    return {"reorder_point": reorder_point, "days_cover": days_cover, "status": status}`,
  },
  {
    id: 'ocr-reader',
    title: 'Invoice & Receipt Reader (OCR)',
    category: 'automation',
    categoryLabel: 'Document Automation',
    tagline: 'Structured bill extraction converting raw receipts into clean CSV ledgers.',
    summary:
      'Extracts vendor name, invoice date, GSTIN, taxable subtotal, and tax amount from photographed bills directly into structured accounting rows.',
    problem:
      'Keying paper vendor receipts into Tally or spreadsheets consumes hours every week and introduces transposition errors.',
    architecture:
      'Python OCR pipeline using regex pattern matching for Indian GSTIN (15-char format), currency tokens, and Pandas DataFrame normalization to CSV.',
    outcome:
      'Reduces manual bookkeeping entry time by turning unstructured receipt text into ready-to-import ledger exports.',
    stack: ['Python', 'OCR', 'Pandas'],
    accentHex: '#F472B6',
    imageUrl: '/src/assets/images/project_ocr_receipt_1795102185467.jpg',
    imageAlt: 'Overhead optical scanner capturing line items from printed vendor receipts',
    frontMetrics: [
      { label: 'Parser', value: '15-Char GSTIN' },
      { label: 'Export', value: 'Pandas CSV' },
    ],
    codeLabel: 'GSTIN & Total Parser (Python)',
    codeSnippet: `import re

GSTIN_PATTERN = r"\\b\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}Z[A-Z\\d]{1}\\b"
AMOUNT_PATTERN = r"(?:Total|Grand Total|Net)[:\\s₹]*([\\d,]+\\.\\d{2})"

def parse_receipt_fields(raw_text: str):
    gstin = re.search(GSTIN_PATTERN, raw_text)
    total = re.search(AMOUNT_PATTERN, raw_text, re.IGNORECASE)
    return {"gstin": gstin.group(0) if gstin else None, "total": total.group(1) if total else None}`,
  },
  {
    id: 'loan-emi-ratio',
    title: 'Loan EMI & Financial Ratio Calculator',
    category: 'fintech',
    categoryLabel: 'Corporate & Credit Finance',
    tagline: 'Interactive amortization schedules paired with liquidity and profitability ratios.',
    summary:
      'Compares business loan structures with full principal-vs-interest breakdowns alongside essential health ratios: Current Ratio, Debt-to-Equity, and Net Margin.',
    problem:
      'Small business borrowers evaluate loans purely on monthly EMI without assessing working-capital liquidity or total interest burden.',
    architecture:
      'Pure TypeScript financial math module implementing compound reducing-balance EMI formulas and standard GAAP/Ind-AS ratio benchmarks.',
    outcome:
      'Gives founders instant clarity on debt serviceability before committing to credit terms.',
    stack: ['TypeScript', 'Financial Modeling'],
    accentHex: '#22D3EE',
    imageUrl: '/src/assets/images/project_loan_emi_1795102184038.jpg',
    imageAlt: 'Digital tablet displaying loan amortization curve and financial ratio gauges beside brass weights',
    frontMetrics: [
      { label: 'Method', value: 'Reducing Bal.' },
      { label: 'Benchmark', value: 'Current Ratio' },
    ],
    codeLabel: 'Reducing-Balance EMI Formula',
    codeSnippet: `export function calculateEMI(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}`,
  },
];

export const EDUCATION = [
  {
    degree: 'Bachelor of Computer Applications (BCA) — Completed',
    institution: 'Auxilium College (Autonomous), Vellore',
    period: '2023 – 2026',
    score: '67.5% Aggregate',
    highlights: [
      'Core coursework in Database Management Systems (SQL), Python Programming, and Web Technologies.',
      'Built practical software engineering projects tailored to retail billing, taxation, and financial reporting.',
    ],
  },
  {
    degree: 'Higher Secondary Certificate (HSC) — Commerce Group',
    institution: 'State Board · Tamil Nadu',
    period: 'Completed 2023',
    score: '85.0% Score',
    highlights: [
      'Strong academic grounding in Accountancy, Commerce, Economics, and Business Mathematics.',
      'Direct domain fluency in ledger reconciliation, GST mechanics, and financial statement analysis.',
    ],
  },
];
