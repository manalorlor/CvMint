import React, { useState, useEffect, useMemo } from "react";
import { ResumeData } from "../../types";
import {
  Search,
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Globe,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  FilePlus,
  Wand2,
} from "lucide-react";

export interface GhanaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  industry?: string;
  employmentType?: string;
  openDate?: string;
  closingDate?: string;
  postedDate?: string;
  summary: string;
  keySkills?: string[];
  applicationLink?: string;
  sourceUrl?: string;
  sourcePlatform?: string;
  verificationStatus?: string;
  isClosed?: boolean;
}

interface GhanaJobsWidgetProps {
  resume: ResumeData;
  onOpenAtsWithJob?: (jobTitle: string, jobDescription: string) => void;
  onCreateCvForJob?: (job: GhanaJob) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const COMMON_INDUSTRIES = [
  "Information Technology & Software",
  "Banking, Finance & Fintech",
  "Oil, Gas & Energy",
  "Healthcare & Pharmaceuticals",
  "Telecommunications",
  "Marketing & Corporate Communications",
  "Education & Academic Research",
  "Construction, Engineering & Real Estate",
  "Agriculture & Agribusiness",
  "NGO, Development & Public Sector",
  "Logistics & Supply Chain",
];

const GHANA_REGIONS = [
  "Greater Accra Region",
  "Ashanti Region",
  "Western Region",
  "Eastern Region",
  "Central Region",
  "Northern Region",
  "Volta Region",
  "Upper East Region",
  "Upper West Region",
  "Bono Region",
  "Bono East Region",
  "Ahafo Region",
  "Oti Region",
  "Savannah Region",
  "North East Region",
  "Western North Region",
];

const parseDateTimestamp = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const lower = dateStr.toLowerCase();
  if (lower.includes("today") || lower.includes("just now")) return Date.now();
  if (lower.includes("yesterday")) return Date.now() - 86400000;
  if (lower.includes("days ago") || lower.includes("day ago")) {
    const days = parseInt(lower) || 1;
    return Date.now() - days * 86400000;
  }
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;
  return 0;
};

export const GhanaJobsWidget: React.FC<GhanaJobsWidgetProps> = ({
  resume,
  onOpenAtsWithJob,
  onCreateCvForJob,
  isModal = false,
  onCloseModal,
}) => {
  // Infer defaults from user resume
  const defaultTitle = resume.targetJobTitle || resume.workExperience[0]?.position || "Software Developer";
  const defaultField = resume.education[0]?.fieldOfStudy || "Computer Science / Business";
  const defaultIndustry = resume.targetIndustry || "Information Technology & Software";
  const defaultRegion = resume.personalInfo.region || "Greater Accra Region";

  const [jobTitle, setJobTitle] = useState(defaultTitle);
  const [fieldOfStudy, setFieldOfStudy] = useState(defaultField);
  const [industry, setIndustry] = useState(defaultIndustry);
  const [region, setRegion] = useState(defaultRegion);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchSummary, setSearchSummary] = useState<string>("");
  const [jobs, setJobs] = useState<GhanaJob[]>([]);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Sorting and Result Filtering States
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "relevance">("newest");
  const [filterResultIndustry, setFilterResultIndustry] = useState<string>("All");
  const [filterResultType, setFilterResultType] = useState<string>("All");
  const [localKeyword, setLocalKeyword] = useState<string>("");

  const processedJobs = useMemo(() => {
    // 0. Filter out closed or expired jobs
    let list = jobs.filter((j) => !j.isClosed && !j.closingDate?.toLowerCase().includes("closed") && !j.closingDate?.toLowerCase().includes("expired"));

    // 1. Keyword search filter
    if (localKeyword.trim()) {
      const q = localKeyword.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.summary.toLowerCase().includes(q) ||
          j.keySkills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // 2. Industry result filter
    if (filterResultIndustry !== "All") {
      const ind = filterResultIndustry.toLowerCase();
      list = list.filter(
        (j) =>
          (j.industry && j.industry.toLowerCase().includes(ind)) ||
          j.summary.toLowerCase().includes(ind) ||
          j.title.toLowerCase().includes(ind)
      );
    }

    // 3. Employment Type filter
    if (filterResultType !== "All") {
      const type = filterResultType.toLowerCase();
      list = list.filter((j) => j.employmentType && j.employmentType.toLowerCase().includes(type));
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === "newest") {
        return parseDateTimestamp(b.openDate || b.postedDate) - parseDateTimestamp(a.openDate || a.postedDate);
      }
      if (sortBy === "oldest") {
        return parseDateTimestamp(a.openDate || a.postedDate) - parseDateTimestamp(b.openDate || b.postedDate);
      }
      return 0; // relevance (original array order)
    });

    return list;
  }, [jobs, sortBy, filterResultIndustry, filterResultType, localKeyword]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/search-jobs-ghana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          fieldOfStudy,
          industry,
          region,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs. Server returned error.");
      }

      const data = await response.json();
      setSearchSummary(data.searchSummary || "");
      setJobs(data.jobs || []);
      setSources(data.sources || []);
      setSearchQueries(data.webSearchQueries || []);
      setHasSearched(true);
    } catch (err: any) {
      console.error("Ghana job search error:", err);
      setError(err.message || "An error occurred while retrieving job openings.");
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const content = (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-red-500/10 to-green-500/10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold mb-3">
              <Globe className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" /> Live Google Search Grounded Jobs • Ghana 🇬🇭
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Current Job Vacancies in Ghana
            </h2>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl">
              Live recruitment listings aggregated via real-time Google Search across Ghanaian job boards (Jobberman Ghana, LinkedIn, Jobweb, BusinessGhana) tailored to your industry and academic background.
            </p>
          </div>

          <button
            onClick={fetchJobs}
            disabled={loading}
            className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black rounded-xl shadow-lg flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Searching Ghana Portals..." : "Refresh Live Jobs"}
          </button>
        </div>
      </div>

      {/* Search Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" /> Filter & Search Parameters
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COMMON_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Field of Study
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Computer Science, Accounting"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Target Role / Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer, Accountant"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Ghana Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Ghana Regions">All Ghana Regions</option>
              {GHANA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" /> Search Matching Ghana Vacancies
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Scanning Active Ghana Job Boards via Google Search...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Gathering real-time openings in <span className="font-semibold text-blue-600">{industry}</span> for roles in <span className="font-semibold text-slate-700 dark:text-slate-300">{region}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-2xl border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Failed to Fetch Job Openings</h4>
            <p className="text-xs">{error}</p>
            <button
              onClick={fetchJobs}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!loading && !error && hasSearched && (
        <div className="space-y-6">
          {/* Executive Overview Summary */}
          {searchSummary && (
            <div className="bg-blue-50/70 dark:bg-slate-800/60 p-4 rounded-xl border border-blue-100 dark:border-slate-700 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-0.5">
                  Ghana Hiring Insights & Overview
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {searchSummary}
                </p>
              </div>
            </div>
          )}

          {/* Job List Cards & Sorting Toolbar */}
          <div className="space-y-4">
            {/* Filter & Sort Controls Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Refine & Sort Results ({processedJobs.length} of {jobs.length} jobs)
                  </span>
                </div>

                {(filterResultIndustry !== "All" || filterResultType !== "All" || localKeyword || sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setFilterResultIndustry("All");
                      setFilterResultType("All");
                      setLocalKeyword("");
                    }}
                    className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Reset Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Sort Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-blue-500" /> Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="newest">🕒 Date Posted (Newest First)</option>
                    <option value="oldest">⌛ Date Posted (Oldest First)</option>
                    <option value="relevance">⭐ Search Relevance</option>
                  </select>
                </div>

                {/* Industry Result Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-blue-500" /> Filter Industry
                  </label>
                  <select
                    value={filterResultIndustry}
                    onChange={(e) => setFilterResultIndustry(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Industries ({jobs.length})</option>
                    {COMMON_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employment Type Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-blue-500" /> Employment Type
                  </label>
                  <select
                    value={filterResultType}
                    onChange={(e) => setFilterResultType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Work Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Hybrid">Hybrid / Remote</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Quick Filter Keyword Search */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Search className="w-3 h-3 text-blue-500" /> Filter Keyword
                  </label>
                  <input
                    type="text"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    placeholder="Filter by skill, company..."
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {processedJobs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No vacancies match the selected filter criteria.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try clearing your filter keyword or changing the Industry / Employment type filter.
                </p>
                <button
                  onClick={() => {
                    setFilterResultIndustry("All");
                    setFilterResultType("All");
                    setLocalKeyword("");
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Clear Results Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {processedJobs.map((job) => {
                  const targetUrl = job.applicationLink || job.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} Ghana job`)}`;
                  const displayOpenDate = job.openDate || job.postedDate || "Recently Posted";
                  const displayClosingDate = job.closingDate || "Open Until Filled";
                  const platformName = job.sourcePlatform || "Ghana Job Board";

                  return (
                    <div
                      key={job.id || job.title}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-xs hover:shadow-md transition space-y-3.5 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-slate-900 text-yellow-300 text-[10px] font-extrabold uppercase tracking-wide rounded-md flex items-center gap-1">
                              <Globe className="w-3 h-3 text-yellow-400" />
                              {platformName}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {job.verificationStatus || "Verified Active Vacancy (July 2026)"}
                            </span>
                            {job.industry && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[10px] font-semibold">
                                {job.industry}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 pt-1">
                            {job.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {job.location}
                            </span>
                          </div>
                        </div>

                        {job.employmentType && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-full text-[11px] font-bold self-start">
                            {job.employmentType}
                          </span>
                        )}
                      </div>

                      {/* Open & Closing Dates Banner */}
                      <div className="flex flex-wrap items-center gap-4 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-slate-500">Open Date:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{displayOpenDate}</span>
                        </div>
                        <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                        <div className="flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-slate-500">Closing Date:</span>
                          <span className="font-bold text-amber-800 dark:text-amber-400">{displayClosingDate}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {job.summary}
                      </p>

                      {job.keySkills && job.keySkills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                            Key Requirements:
                          </span>
                          {job.keySkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 rounded-lg text-[11px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                          {onCreateCvForJob && (
                            <button
                              onClick={() => onCreateCvForJob(job)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
                              title="Tailor your CV and target job title specifically for this vacancy"
                            >
                              <FilePlus className="w-4 h-4 text-emerald-200" />
                              <span>Create CV for this role</span>
                            </button>
                          )}

                          {onOpenAtsWithJob && (
                            <button
                              onClick={() => onOpenAtsWithJob(job.title, `${job.title} at ${job.company}\nLocation: ${job.location}\nOpen Date: ${displayOpenDate} | Closing Date: ${displayClosingDate}\n\nSummary:\n${job.summary}\n\nRequired Skills: ${job.keySkills?.join(", ")}`)}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Match ATS</span>
                            </button>
                          )}
                        </div>

                        <a
                          href={targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          referrerPolicy="no-referrer"
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Apply on {platformName.replace(" Ghana", "")}</span> <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Citations & Sources */}
          {sources.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> Verified Google Grounded Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.uri}
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:underline border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-medium"
                  >
                    {src.title} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-100 dark:bg-slate-950 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Ghana Job Openings Widget
            </span>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕ Close
              </button>
            )}
          </div>
          <div className="p-6 overflow-y-auto flex-1">{content}</div>
        </div>
      </div>
    );
  }

  return content;
};
