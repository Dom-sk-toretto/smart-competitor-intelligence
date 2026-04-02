import React, { useState, useEffect, useContext, useMemo } from "react";
import { AppDataContext } from "../App";
import { Competitor, CompetitorAnalysisResult } from "../types";
import {
  PlusIcon,
  CloseIcon,
  SparklesIcon,
  ChartBarIcon,
  SpinnerIcon,
  SearchIcon,
  FilterIcon,
} from "../components/icons";
import {
  generateSingleCompetitorAnalysis,
  validateCompetitorUrl,
} from "../services/geminiService";

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    newCompetitor: Omit<Competitor, "id" | "logo" | "lastUpdated">
  ) => void;
}

const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [isVerifyingUrl, setIsVerifyingUrl] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifyingUrl) return;

    // Basic regex validation first
    const newErrors: { name?: string; url?: string } = {};
    const nameRegex = /^[^\s].{1,49}$/;
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})([\/\w .-]*)*\/?$/;

    if (
      !name.trim() ||
      !nameRegex.test(name) ||
      name.length < 2 ||
      name.length > 50
    ) {
      newErrors.name =
        "Competitor name must be 2-50 characters and cannot start with a space.";
    }

    if (!url.trim() || !urlRegex.test(url)) {
      newErrors.url =
        "Please enter a valid URL format starting with http:// or https://";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If basic validation passes, proceed to AI validation
    setErrors({});
    setIsVerifyingUrl(true);

    onSave({
      name,
      domain: new URL(url).hostname,
      description: notes,
      status: "Active",
      tags: ["New"],
    });

    handleClose();

    setIsVerifyingUrl(false);
  };

  const handleClose = () => {
    setName("");
    setUrl("");
    setNotes("");
    setErrors({});
    setIsVerifyingUrl(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeInUp"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Add New Competitor</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="competitorName"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Competitor Name
              </label>
              <input
                id="competitorName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter competitor company name"
                className={`w-full bg-slate-800 border ${
                  errors.name ? "border-red-500" : "border-slate-600"
                } rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="competitorURL"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Competitor URL
              </label>
              <input
                id="competitorURL"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://competitor.com"
                className={`w-full bg-slate-800 border ${
                  errors.url ? "border-red-500" : "border-slate-600"
                } rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
              />
              {isVerifyingUrl && (
                <SpinnerIcon className="absolute right-3 top-10 h-5 w-5 animate-spin text-cyan-400" />
              )}
              {errors.url && (
                <p className="text-red-400 text-xs mt-1">{errors.url}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="competitorNotes"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Notes
              </label>
              <textarea
                id="competitorNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes (e.g., product category, key focus)"
                rows={3}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-6 border-t border-slate-700 space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-bold text-slate-300 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifyingUrl}
              className="flex items-center justify-center min-w-[130px] px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
            >
              {isVerifyingUrl ? (
                <>
                  <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Save Competitor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitor: Competitor | null;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  competitor,
}) => {
  const [result, setResult] = useState<CompetitorAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && competitor && !result) {
      const analyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
          const analysisResult = await generateSingleCompetitorAnalysis(
            competitor
          );
          setResult(analysisResult);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        } finally {
          setIsAnalyzing(false);
        }
      };
      analyze();
    }
  }, [isOpen, competitor, result]);

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeInUp"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-cyan-400" />
            AI Analysis for {competitor?.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-slate-300">
                Analyzing competitor data...
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">
              {error}
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400">
                  AI Summary
                </h3>
                <p className="text-slate-300 mt-2 text-sm">{result.summary}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400">
                    Market Share
                  </h4>
                  <p className="text-2xl font-bold text-white mt-1">
                    {result.marketShare}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400">
                    Recent Funding
                  </h4>
                  <p className="text-2xl font-bold text-white mt-1">
                    {result.recentFunding}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400">
                    Recent Launches
                  </h4>
                  <p className="text-lg font-bold text-white mt-2">
                    {result.productLaunches.join(", ")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400">
                    Strategic Opportunities
                  </h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
                    {result.opportunities.map((opp, i) => (
                      <li key={i}>{opp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400">
                    Potential Threats
                  </h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
                    {result.threats.map((threat, i) => (
                      <li key={i}>{threat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CompetitorRow: React.FC<{
  competitor: Competitor;
  onAnalyze: (c: Competitor) => void;
}> = ({ competitor, onAnalyze }) => (
  <tr className="bg-slate-900/50 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
    <td className="p-4">
      <div className="flex items-center gap-4">
        <img
          src={competitor.logo}
          alt={competitor.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-bold text-white">{competitor.name}</p>
          <a
            href={`https://${competitor.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-cyan-400"
          >
            {competitor.domain}
          </a>
        </div>
      </div>
    </td>
    <td className="p-4 text-slate-300 max-w-sm">
      <p>{competitor.description}</p>
    </td>
    <td className="p-4">
      <div className="flex flex-wrap gap-2">
        {competitor.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </td>
    <td className="p-4">
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          competitor.status === "Active"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {competitor.status}
      </span>
    </td>
    <td className="p-4 text-slate-400 text-sm">{competitor.lastUpdated}</td>
    <td className="p-4 text-center">
      <button
        onClick={() => onAnalyze(competitor)}
        className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2 rounded-lg transition-colors"
      >
        <ChartBarIcon className="w-4 h-4" />
        <span>Analyze</span>
      </button>
    </td>
  </tr>
);

const CompetitorsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const appData = useContext(AppDataContext);

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] =
    useState<Competitor | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  if (!appData) return <div>Loading...</div>; // Handle context not being available yet

  const { competitors, setCompetitors } = appData;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    competitors.forEach((c) => c.tags.forEach((tag) => tags.add(tag)));
    return ["All", ...Array.from(tags)];
  }, [competitors]);

  const filteredCompetitors = useMemo(() => {
    return competitors
      .filter((c) => {
        // Search filter
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(term) ||
          c.domain.toLowerCase().includes(term)
        );
      })
      .filter((c) => {
        // Status filter
        if (statusFilter === "All") return true;
        return c.status === statusFilter;
      })
      .filter((c) => {
        // Tag filter
        if (tagFilter === "All") return true;
        return c.tags.includes(tagFilter);
      });
  }, [competitors, searchTerm, statusFilter, tagFilter]);

  const handleSaveCompetitor = (
    newCompetitorData: Omit<Competitor, "id" | "logo" | "lastUpdated">
  ) => {
    const newCompetitor: Competitor = {
      ...newCompetitorData,
      id: Date.now().toString(),
      logo: `https://picsum.photos/seed/${newCompetitorData.name
        .toLowerCase()
        .replace(/\s/g, "")}/100`,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setCompetitors((prev) => [newCompetitor, ...prev]);
  };

  const handleAnalyzeClick = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    setIsAnalysisModalOpen(true);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Tracked Competitors</h2>
          <p className="text-slate-400 mt-1">
            Manage your list of competitors and view their key information.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Add Competitor
        </button>
      </div>

      <div className="mb-6 bg-slate-900/50 border border-slate-700/80 rounded-xl p-4 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <FilterIcon className="w-6 h-6 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === "All" ? "All Tags" : tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl backdrop-blur-sm overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">
                Competitor
              </th>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">
                Description
              </th>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">
                Tags
              </th>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">
                Status
              </th>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">
                Last Updated
              </th>
              <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((competitor) => (
                <CompetitorRow
                  key={competitor.id}
                  competitor={competitor}
                  onAnalyze={handleAnalyzeClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-8 text-slate-400">
                  No competitors found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCompetitor}
      />
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        competitor={selectedCompetitor}
      />
    </div>
  );
};

export default CompetitorsPage;
