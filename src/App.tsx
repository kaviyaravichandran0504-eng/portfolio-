import { useState, FormEvent } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Play,
  Send,
} from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import HeroInteractivePreview from './components/HeroInteractivePreview';
import ProjectVisual from './components/ProjectVisual';
import ProjectSandboxModal from './components/ProjectSandboxModal';
import {
  EDUCATION,
  KEY_METRICS,
  PROFILE,
  PROJECTS,
  ProjectCaseStudy,
  ProjectCategory,
  SKILL_GROUPS,
} from './data/portfolioData';

export default function App() {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredProjects =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const openProjectById = (projectId: string) => {
    const found = PROJECTS.find((p) => p.id === projectId);
    if (found) setActiveProject(found);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !messageText.trim()) return;
    setFormSubmitted(true);
    setSenderName('');
    setSenderEmail('');
    setMessageText('');
  };

  const marqueeItems = [
    'GST Compliance',
    'SQL Ledger Queries',
    'Financial Modeling',
    'Python Automation',
    'Power BI Dashboards',
    'Tally & Bookkeeping',
  ];

  return (
    <div className="relative min-h-screen bg-[#06090F] text-[#F1F5F9]">
      {/* Interactive 3D Three.js Background */}
      <ThreeBackground />

      {/* 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#06090F]/92 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-slate-100 hover:text-teal-300 transition-colors whitespace-nowrap shrink-0"
          >
            {PROFILE.name}
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400"
          >
            <a
              href="#about"
              className="hover:text-slate-100 hover:underline underline-offset-4 decoration-teal-400/70 transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#skills"
              className="hover:text-slate-100 hover:underline underline-offset-4 decoration-teal-400/70 transition-colors whitespace-nowrap shrink-0"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="hover:text-slate-100 hover:underline underline-offset-4 decoration-teal-400/70 transition-colors whitespace-nowrap shrink-0"
            >
              Projects
            </a>
            <a
              href="#education"
              className="hover:text-slate-100 hover:underline underline-offset-4 decoration-teal-400/70 transition-colors whitespace-nowrap shrink-0"
            >
              Education
            </a>
          </nav>

          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* Split-Screen Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-medium text-teal-400">
                {PROFILE.greeting}
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.06] text-slate-50 text-balance mt-2">
                {PROFILE.name}
              </h1>

              <p className="mt-3 text-base sm:text-lg font-medium text-amber-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span>{PROFILE.degreeLine}</span>
                <span aria-hidden="true" className="text-slate-600">|</span>
                <span className="text-slate-200">{PROFILE.location}</span>
              </p>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl mt-5">
                {PROFILE.heroBio}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore Interactive Projects</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroInteractivePreview onOpenProject={openProjectById} />
            </div>
          </div>

          {/* Full-Width 4-Column Proof Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {KEY_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl bg-[#0B111E]/90 border border-slate-800/90 px-5 py-4"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-teal-400 tabular-nums">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Subtle Editorial Section Ribbon */}
        <div
          aria-hidden="true"
          className="border-y border-slate-800/80 bg-[#080D17]/90 overflow-hidden py-3"
        >
          <div className="flex w-max animate-marquee text-xs font-medium text-slate-400 tracking-wide">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span key={idx} className="inline-flex items-center whitespace-nowrap">
                <span className="px-5">{item}</span>
                <span className="text-teal-500/60">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Projects Showcase — Projects That Talk */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <p className="text-xs font-medium text-teal-400">Selected Work</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mt-1">
                Projects Built to Talk Through Real Business Logic
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-2">
                Toggle between visual previews and system diagrams directly on each project, or
                launch any interactive sandbox to test live calculations and inspect SQL, Python, or
                DAX code.
              </p>
            </div>

            {/* Interactive Segmented Filter Control */}
            <div
              role="group"
              aria-label="Filter projects by domain"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#0B111E] border border-slate-800 self-start md:self-auto"
            >
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'fintech', label: 'Fintech' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'automation', label: 'Automation' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    filter === tab.id
                      ? 'bg-teal-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#0B111E]/95 border border-slate-800/90 overflow-hidden hover:border-teal-500/50 transition-colors"
              >
                <div>
                  <ProjectVisual
                    project={project}
                    onLaunchDemo={(p) => setActiveProject(p)}
                  />

                  <div className="p-6">
                    <p className="text-xs font-medium text-amber-400">
                      {project.categoryLabel} · {project.stack.join(' / ')}
                    </p>
                    <h3 className="font-display text-lg font-bold text-slate-50 mt-1.5 group-hover:text-teal-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mt-2">
                      {project.summary}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-slate-200 font-medium">Impact: </span>
                      {project.outcome}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/35 hover:bg-teal-500 hover:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Launch Live Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Architecture &amp; Code
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About & Skills Section */}
        <section
          id="about"
          className="border-t border-slate-800/80 bg-[#080D17]/85"
        >
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20 space-y-16">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-medium text-teal-400">About</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mt-1 text-balance">
                  Where Commerce Meets Code
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <p className="text-base text-slate-300 leading-relaxed">
                  {PROFILE.aboutSummary}
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  <span className="text-slate-200 font-medium">Target Roles: </span>
                  {PROFILE.targetRoles.join(' · ')}
                </p>
              </div>
            </div>

            <div id="skills" className="pt-12 border-t border-slate-800/80">
              <div className="mb-8">
                <p className="text-xs font-medium text-amber-400">Capabilities</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mt-1">
                  Technical &amp; Financial Competency Matrix
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {SKILL_GROUPS.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-2xl bg-[#0B111E]/95 border border-slate-800/90 p-6"
                  >
                    <h3 className="font-display text-lg font-bold text-slate-50">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 pb-4 border-b border-slate-800/80">
                      {group.subtitle}
                    </p>
                    <ul className="divide-y divide-slate-800/70 mt-2">
                      {group.items.map((item) => (
                        <li key={item.name} className="py-3">
                          <div className="text-sm font-semibold text-slate-100">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
            <div className="mb-8">
              <p className="text-xs font-medium text-teal-400">Academic Background</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mt-1">
                Education &amp; Qualifications
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.degree}
                  className="rounded-2xl bg-[#0B111E]/95 border border-slate-800/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-400 font-medium">
                      <span>{edu.period}</span>
                      <span className="font-mono tabular-nums text-teal-300">{edu.score}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-50 mt-2">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">{edu.institution}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-300 list-disc pl-4">
                      {edu.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="border-t border-slate-800/80 bg-[#080D17]/90"
        >
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <p className="text-xs font-medium text-amber-400">Get in Touch</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mt-1">
                    Open to Internships &amp; Entry-Level Roles
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-3">
                    Looking to contribute to fintech products, data reporting pipelines, or
                    finance operations teams in Tamil Nadu or remote roles.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span>{PROFILE.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 hover:border-teal-400 transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  className="rounded-2xl bg-[#0B111E] border border-slate-800 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-display text-base font-semibold text-slate-100">
                      Send a Quick Message
                    </h3>
                    <span className="text-xs text-slate-400">Direct Inquiry</span>
                  </div>

                  {formSubmitted ? (
                    <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-sm text-teal-200 flex items-center justify-between gap-4">
                      <span>
                        Thanks for reaching out. Your note is ready—you can also email directly at{' '}
                        {PROFILE.email}.
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormSubmitted(false)}
                        className="text-xs font-semibold text-teal-300 underline cursor-pointer shrink-0"
                      >
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-name" className="block text-xs text-slate-400 mb-1.5">
                            Your Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Hiring Manager / Recruiter"
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#070B14] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-xs text-slate-400 mb-1.5">
                            Email Address
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#070B14] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contact-msg" className="block text-xs text-slate-400 mb-1.5">
                          Message
                        </label>
                        <textarea
                          id="contact-msg"
                          rows={3}
                          required
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Share role details, internship timelines, or project feedback..."
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#070B14] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Send Message</span>
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#06090F] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>© 2026 {PROFILE.name} · {PROFILE.location}</span>
          <span>BCA Graduate · Finance &amp; Data</span>
        </div>
      </footer>

      {/* Interactive Project Modal */}
      <ProjectSandboxModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
}
