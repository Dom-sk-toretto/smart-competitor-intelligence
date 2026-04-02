import React, { useState, useContext, useMemo } from 'react';
import { AppDataContext } from '../App';
import { Competitor, CompanyDetails, ComparisonData } from '../types';
import { CompareIcon, DocumentArrowDownIcon, ShareIcon, SparklesIcon } from '../components/icons';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { generateCompetitorComparison } from '../services/geminiService';


const ComparisonView: React.FC<{ analysisResult: ComparisonData }> = ({ analysisResult }) => {
    const { table, charts } = analysisResult;
    
    // A more distinct and accessible color palette for the charts
    const CHART_COLORS = ['#3B82F6', '#14B8A6', '#8B5CF6']; // Your Company (Blue), Competitor A (Teal), Competitor B (Purple)

    // Transform radar data for Recharts
    const radarChartData = useMemo(() => {
        const subjects = charts.featuresRadarChart.subjects.map(s => s.subject);
        const transformed: { subject: string; [key: string]: number | string }[] = subjects.map(subject => ({ subject }));

        charts.featuresRadarChart.data.forEach(companyData => {
            companyData.values.forEach(featureValue => {
                const subjectEntry = transformed.find(t => t.subject === featureValue.subject);
                if (subjectEntry) {
                    subjectEntry[companyData.company] = featureValue.value;
                }
            });
        });

        // Ensure all companies have a value for every subject, defaulting to 0
        const companyNames = charts.featuresRadarChart.data.map(d => d.company);
        transformed.forEach(subjectEntry => {
            companyNames.forEach(companyName => {
                if (!(companyName in subjectEntry)) {
                    subjectEntry[companyName] = 0;
                }
            });
        });

        return transformed;
    }, [charts.featuresRadarChart]);

    return (
        <div className="space-y-8 animate-fadeInUp">
            <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl backdrop-blur-sm overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-800/50">
                        <tr>
                            {table.columns.map(col => <th key={col.id} className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map(row => (
                            <tr key={row.parameter} className="border-b border-slate-800">
                                <td className="p-4 font-bold text-white align-top">{row.parameter}</td>
                                {row.data.map((cellData, index) => (
                                    <td key={index} className="p-4 text-slate-300 align-top">
                                        <ul className="list-disc list-inside space-y-1">
                                            {cellData.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                                        </ul>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Pricing Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.pricingBarChart.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" label={{ value: 'USD/month', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Bar dataKey="price">
                                {charts.pricingBarChart.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Feature Coverage</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis dataKey="subject" stroke="#e2e8f0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Legend />
                            {charts.featuresRadarChart.data.map((c, i) => (
                                <Radar key={c.company} name={c.company} dataKey={c.company} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.6} />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="flex justify-end items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors">
                    <ShareIcon className="w-4 h-4" />
                    Share Report
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors">
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Export as PDF
                </button>
            </div>
        </div>
    );
};

const ComparePage: React.FC = () => {
    // Consume live data from the global context
    const appData = useContext(AppDataContext);
    const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([]);
    const [analysisResult, setAnalysisResult] = useState<ComparisonData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!appData) return <div>Loading...</div>;
    const { companyDetails, competitors } = appData;

    // Memoize the selected competitors array based on IDs and context data
    const selectedCompetitors = useMemo(() =>
        competitors.filter(c => selectedCompetitorIds.includes(c.id)),
        [selectedCompetitorIds, competitors]
    );

    const toggleCompetitor = (id: string) => {
        setAnalysisResult(null); // Reset analysis when selection changes
        setSelectedCompetitorIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return prev;
        });
    };
    
    const handleGenerateComparison = async () => {
        // Robustness check: Ensure user's company details are set before making an API call
        if (!companyDetails.name || !companyDetails.url || companyDetails.name === 'My Awesome Inc.') {
            setError("Please set your company name and URL in the 'Account > My Company' settings before generating a comparison.");
            return;
        }

        if (selectedCompetitors.length === 0) {
            setError("Please select at least one competitor to generate a comparison.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            // Use live data from context for the API call
            const result = await generateCompetitorComparison(companyDetails, selectedCompetitors);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-8 animate-fadeInUp">
            <div>
                <h2 className="text-3xl font-bold text-white">AI-Powered Comparison</h2>
                <p className="text-slate-400 mt-1">Select competitors and let our AI generate a detailed comparison report.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Select Competitors</h3>
                        <p className="text-slate-400 text-sm">Choose up to 2 competitors to compare against your company.</p>
                    </div>
                    <button 
                        onClick={handleGenerateComparison}
                        disabled={isLoading || selectedCompetitorIds.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                             <>
                                <SparklesIcon className="w-5 h-5"/>
                                Generate Comparison
                            </>
                        )}
                    </button>
                </div>
                 <div className="flex flex-wrap gap-4 mt-4">
                     <div className="flex items-center gap-3 p-3 rounded-lg border-2 bg-green-600/20 border-green-500 cursor-default">
                        <img src={`https://picsum.photos/seed/${companyDetails.name}/100`} alt={companyDetails.name} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-white text-sm">{companyDetails.name} (You)</span>
                    </div>
                    {/* Dynamically render competitor selection from global state */}
                    {competitors.map(c => (
                        <button
                            key={c.id}
                            onClick={() => toggleCompetitor(c.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                                selectedCompetitorIds.includes(c.id)
                                    ? 'bg-blue-600/20 border-blue-500'
                                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold text-white text-sm">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">{error}</div>}

            {analysisResult && !isLoading && (
                <ComparisonView analysisResult={analysisResult} />
            )}

            {!analysisResult && !isLoading && (
                <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
                    <CompareIcon className="mx-auto h-12 w-12 text-slate-500" />
                    <h3 className="mt-2 text-xl font-medium text-white">Ready for Analysis</h3>
                    <p className="mt-1 text-sm text-slate-400">Choose at least one competitor and click "Generate Comparison".</p>
                </div>
            )}
        </div>
    );
};

export default ComparePage;