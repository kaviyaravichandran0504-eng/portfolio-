import { useState } from 'react';
import { Eye, Layers, Play } from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolioData';

interface ProjectVisualProps {
  project: ProjectCaseStudy;
  onLaunchDemo: (project: ProjectCaseStudy) => void;
}

function SchematicFallback({ projectId }: { projectId: string }) {
  switch (projectId) {
    case 'gst-invoice':
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="GST Invoice schematic preview" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#08131E" />
          <path d="M0 240 Q120 200 240 230 T400 210 L400 300 L0 300 Z" fill="#0F766E" opacity="0.16" />
          <rect x="44" y="34" width="214" height="215" rx="10" fill="#0E1B2B" stroke="#1E3A4C" />
          <rect x="64" y="54" width="76" height="8" rx="4" fill="#14B8A6" />
          <rect x="190" y="54" width="48" height="8" rx="4" fill="#334155" />
          <line x1="64" y1="78" x2="238" y2="78" stroke="#1E293B" />
          <rect x="64" y="96" width="120" height="7" rx="3" fill="#475569" />
          <rect x="204" y="96" width="34" height="7" rx="3" fill="#64748B" />
          <rect x="64" y="118" width="96" height="7" rx="3" fill="#475569" />
          <rect x="204" y="118" width="34" height="7" rx="3" fill="#64748B" />
          <line x1="64" y1="152" x2="238" y2="152" stroke="#1E293B" strokeDasharray="4 4" />
          <text x="64" y="182" fontSize="13" fill="#94A3B8" fontFamily="monospace">CGST 9% + SGST 9%</text>
          <text x="64" y="214" fontSize="20" fontWeight="700" fill="#2DD4BF" fontFamily="monospace">₹ 11,800.00</text>
          <rect x="278" y="64" width="84" height="72" rx="10" fill="#132235" stroke="#F59E0B" strokeOpacity="0.5" />
          <text x="320" y="98" textAnchor="middle" fontSize="20" fontWeight="700" fill="#FBBF24" fontFamily="monospace">18%</text>
          <text x="320" y="118" textAnchor="middle" fontSize="11" fill="#94A3B8" fontFamily="sans-serif">HSN 9983</text>
        </svg>
      );

    case 'expense-budget':
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="Expense and budget variance chart" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#0B111C" />
          <circle cx="122" cy="145" r="62" fill="none" stroke="#1E293B" strokeWidth="16" />
          <circle cx="122" cy="145" r="62" fill="none" stroke="#14B8A6" strokeWidth="16" strokeDasharray="190 390" />
          <circle cx="122" cy="145" r="62" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="115 390" strokeDashoffset="-196" />
          <circle cx="122" cy="145" r="62" fill="none" stroke="#F43F5E" strokeWidth="16" strokeDasharray="65 390" strokeDashoffset="-316" />
          <text x="122" y="140" textAnchor="middle" fontSize="13" fill="#94A3B8" fontFamily="sans-serif">Budget</text>
          <text x="122" y="162" textAnchor="middle" fontSize="18" fontWeight="700" fill="#F8FAFC" fontFamily="monospace">82%</text>
          <g transform="translate(212, 74)">
            <rect width="144" height="12" rx="6" fill="#1E293B" />
            <rect width="108" height="12" rx="6" fill="#14B8A6" />
            <rect y="36" width="144" height="12" rx="6" fill="#1E293B" />
            <rect y="36" width="128" height="12" rx="6" fill="#F59E0B" />
            <rect y="72" width="144" height="12" rx="6" fill="#1E293B" />
            <rect y="72" width="140" height="12" rx="6" fill="#F43F5E" />
            <rect y="108" width="144" height="12" rx="6" fill="#1E293B" />
            <rect y="108" width="76" height="12" rx="6" fill="#38BDF8" />
          </g>
        </svg>
      );

    case 'sales-analytics':
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="Sales analytics margin chart" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#08111E" />
          <g stroke="#162234" strokeWidth="1">
            <line x1="40" y1="60" x2="360" y2="60" />
            <line x1="40" y1="115" x2="360" y2="115" />
            <line x1="40" y1="170" x2="360" y2="170" />
            <line x1="40" y1="225" x2="360" y2="225" />
          </g>
          <rect x="58" y="160" width="30" height="65" rx="4" fill="#1D4ED8" opacity="0.85" />
          <rect x="110" y="128" width="30" height="97" rx="4" fill="#2563EB" opacity="0.85" />
          <rect x="162" y="146" width="30" height="79" rx="4" fill="#3B82F6" opacity="0.9" />
          <rect x="214" y="96" width="30" height="129" rx="4" fill="#38BDF8" />
          <rect x="266" y="80" width="30" height="145" rx="4" fill="#14B8A6" />
          <rect x="318" y="60" width="30" height="165" rx="4" fill="#2DD4BF" />
          <polyline
            points="73,144 125,112 177,128 229,82 281,66 333,46"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="333" cy="46" r="6" fill="#FBBF24" />
        </svg>
      );

    case 'inventory-alerts':
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="Inventory stock threshold visual" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#0C0F1D" />
          <g transform="translate(46, 58)">
            <rect width="308" height="44" rx="8" fill="#131B2E" stroke="#1E293B" />
            <rect x="16" y="16" width="96" height="12" rx="4" fill="#64748B" />
            <rect x="184" y="16" width="64" height="12" rx="4" fill="#14B8A6" />
            <text x="278" y="26" fontSize="11" fill="#2DD4BF" fontFamily="monospace" textAnchor="middle">OK</text>

            <rect y="64" width="308" height="44" rx="8" fill="#131B2E" stroke="#F59E0B" strokeOpacity="0.45" />
            <rect x="16" y="80" width="116" height="12" rx="4" fill="#64748B" />
            <rect x="184" y="80" width="38" height="12" rx="4" fill="#F59E0B" />
            <text x="278" y="90" fontSize="11" fill="#FBBF24" fontFamily="monospace" textAnchor="middle">LOW</text>

            <rect y="128" width="308" height="44" rx="8" fill="#1A1220" stroke="#F43F5E" strokeOpacity="0.55" />
            <rect x="16" y="144" width="88" height="12" rx="4" fill="#94A3B8" />
            <rect x="184" y="144" width="18" height="12" rx="4" fill="#F43F5E" />
            <text x="278" y="154" fontSize="11" fill="#FDA4AF" fontFamily="monospace" textAnchor="middle">ALERT</text>
          </g>
        </svg>
      );

    case 'ocr-reader':
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="Receipt OCR extraction pipeline visual" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#0E0E1A" />
          <rect x="44" y="42" width="122" height="206" rx="8" fill="#151828" stroke="#334155" />
          <rect x="62" y="68" width="86" height="7" rx="3" fill="#64748B" />
          <rect x="62" y="90" width="68" height="7" rx="3" fill="#475569" />
          <rect x="62" y="112" width="88" height="7" rx="3" fill="#475569" />
          <rect x="62" y="166" width="80" height="10" rx="3" fill="#F472B6" />
          <line x1="34" y1="142" x2="176" y2="142" stroke="#22D3EE" strokeWidth="3" />
          <path d="M182 142 L222 142" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 5" />
          <polygon points="222,136 234,142 222,148" fill="#38BDF8" />
          <rect x="242" y="58" width="118" height="172" rx="10" fill="#0B1322" stroke="#1E3A5F" />
          <text x="256" y="94" fontSize="11" fill="#94A3B8" fontFamily="monospace">GSTIN: 33AAB...</text>
          <text x="256" y="126" fontSize="11" fill="#94A3B8" fontFamily="monospace">TAX:   ₹ 152.60</text>
          <text x="256" y="158" fontSize="11" fill="#2DD4BF" fontFamily="monospace">NET:   ₹ 842.00</text>
          <rect x="256" y="182" width="90" height="24" rx="5" fill="#14B8A6" fillOpacity="0.2" />
          <text x="301" y="198" textAnchor="middle" fontSize="10" fill="#5EEAD4" fontFamily="monospace">CSV READY</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 300" role="img" aria-label="Loan EMI and financial ratio gauge" className="w-full h-full object-cover block">
          <rect width="400" height="300" fill="#07131C" />
          <rect x="40" y="48" width="148" height="196" rx="12" fill="#0D1C2B" stroke="#1E3A4C" />
          <rect x="56" y="68" width="116" height="44" rx="8" fill="#0B3B49" />
          <text x="160" y="96" textAnchor="end" fontSize="16" fontWeight="700" fill="#F8FAFC" fontFamily="monospace">₹ 23,410</text>
          <rect x="56" y="132" width="52" height="24" rx="5" fill="#1E293B" />
          <rect x="116" y="132" width="56" height="24" rx="5" fill="#14B8A6" fillOpacity="0.7" />
          <rect x="56" y="172" width="52" height="24" rx="5" fill="#1E293B" />
          <rect x="116" y="172" width="56" height="24" rx="5" fill="#F59E0B" fillOpacity="0.75" />
          <g transform="translate(216, 72)">
            <text x="0" y="18" fontSize="12" fill="#94A3B8" fontFamily="sans-serif">Current Ratio</text>
            <text x="144" y="18" textAnchor="end" fontSize="15" fontWeight="700" fill="#2DD4BF" fontFamily="monospace">2.15x</text>
            <rect y="32" width="144" height="8" rx="4" fill="#1E293B" />
            <rect y="32" width="106" height="8" rx="4" fill="#2DD4BF" />
            <text x="0" y="92" fontSize="12" fill="#94A3B8" fontFamily="sans-serif">Debt / Equity</text>
            <text x="144" y="92" textAnchor="end" fontSize="15" fontWeight="700" fill="#FBBF24" fontFamily="monospace">0.64x</text>
            <rect y="106" width="144" height="8" rx="4" fill="#1E293B" />
            <rect y="106" width="58" height="8" rx="4" fill="#FBBF24" />
          </g>
        </svg>
      );
  }
}

export default function ProjectVisual({ project, onLaunchDemo }: ProjectVisualProps) {
  const [viewMode, setViewMode] = useState<'photo' | 'schematic'>('photo');
  const [imgFailed, setImgFailed] = useState(false);

  const showSchematic = viewMode === 'schematic' || imgFailed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#070B14] border-b border-slate-800/80">
      {/* Main Interactive Media Layer */}
      {showSchematic ? (
        <div
          onClick={() => onLaunchDemo(project)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onLaunchDemo(project);
            }
          }}
          aria-label={`Open ${project.title} interactive sandbox`}
          className="w-full h-full cursor-pointer transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        >
          <SchematicFallback projectId={project.id} />
        </div>
      ) : (
        <img
          src={project.imageUrl}
          alt={project.imageAlt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          onClick={() => onLaunchDemo(project)}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-out group-hover:scale-105"
        />
      )}

      {/* Measured Contrast Scrim for Overlaid Controls */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F] via-[#06090F]/35 to-transparent"
      />

      {/* Top-Right Interactive Photo / Blueprint Switcher */}
      {!imgFailed && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 rounded-lg bg-[#06090F]/88 border border-slate-700/80">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('photo');
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'photo'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('schematic');
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'schematic'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" aria-hidden="true" />
            <span>Diagram</span>
          </button>
        </div>
      )}

      {/* Bottom Interactive Telemetry & Click Affordance Bar */}
      <button
        type="button"
        onClick={() => onLaunchDemo(project)}
        className="absolute inset-x-0 bottom-0 z-10 px-4 py-3 flex items-end justify-between gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <div className="flex items-center gap-4">
          {project.frontMetrics.map((m) => (
            <div key={m.label}>
              <div className="text-[10px] text-slate-300/90 leading-none">{m.label}</div>
              <div className="text-xs font-mono tabular-nums font-semibold text-teal-300 mt-1">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 group-hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Interactive</span>
        </span>
      </button>
    </div>
  );
}
