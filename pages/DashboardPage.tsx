import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SparklesIcon, CompetitorsIcon, BellIcon } from '../components/icons';
import { AppDataContext } from '../App';

const chartData = [
  { name: 'Jan', Teams: 400, Slack: 240, Discord: 180 },
  { name: 'Feb', Teams: 300, Slack: 139, Discord: 221 },
  { name: 'Mar', Teams: 200, Slack: 980, Discord: 229 },
  { name: 'Apr', Teams: 278, Slack: 390, Discord: 200 },
  { name: 'May', Teams: 189, Slack: 480, Discord: 218 },
  { name: 'Jun', Teams: 239, Slack: 380, Discord: 250 },
  { name: 'Jul', Teams: 349, Slack: 430, Discord: 210 },
];

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, icon: Icon, link }) => {
  const cardContent = (
    <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] h-full flex flex-col">
      <div className="flex justify-between items-start">
        <h3 className="text-slate-400">{title}</h3>
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div className="mt-4 flex-grow flex flex-col justify-center">
        <p className="text-4xl font-bold text-white">{value}</p>
        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
          {change} {title !== 'Notifications' && title !== 'AI Insights Generated' && 'vs last month'}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {cardContent}
      </Link>
    );
  }
  return <div>{cardContent}</div>;
};


const DashboardPage: React.FC = () => {
  const appData = useContext(AppDataContext);
  const unreadCount = appData?.notifications.filter(n => !n.read).length ?? 0;
  const insightsCount = appData?.insightsGeneratedCount ?? 0;

  const summaryData: SummaryCardProps[] = [
    { title: "Active Competitors", value: appData?.competitors.length.toString() ?? "0", change: "+8.2%", icon: CompetitorsIcon },
    { title: "Updates This Week", value: "24", change: "+15.3%", icon: SparklesIcon },
    { title: "AI Insights Generated", value: insightsCount.toString(), change: "total", icon: SparklesIcon, link: "/insights" },
    { title: "Notifications", value: unreadCount.toString(), change: "unread", icon: BellIcon, link: "/notifications" },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">Competitor Mentions Trend</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                        <Legend wrapperStyle={{color: '#fff'}}/>
                        <Bar dataKey="Slack" fill="#3B82F6" />
                        <Bar dataKey="Teams" fill="#06B6D4" />
                        <Bar dataKey="Discord" fill="#FACC15" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-6 backdrop-blur-sm">
             <h3 className="text-xl font-bold text-white mb-4">Latest Competitor Moves</h3>
             <ul className="space-y-4">
                 <li className="flex items-center space-x-3">
                     <img src="https://picsum.photos/seed/teams/40" className="w-8 h-8 rounded-full" alt="Teams"/>
                     <p className="text-sm"><span className="font-bold text-white">Microsoft Teams</span> launched a new AI-powered meeting summary feature.</p>
                     <span className="text-xs text-slate-500 ml-auto">2h ago</span>
                 </li>
                 <li className="flex items-center space-x-3">
                     <img src="https://picsum.photos/seed/slack/40" className="w-8 h-8 rounded-full" alt="Slack"/>
                     <p className="text-sm"><span className="font-bold text-white">Slack</span> announced a price increase for its Pro plan.</p>
                     <span className="text-xs text-slate-500 ml-auto">8h ago</span>
                 </li>
                 <li className="flex items-center space-x-3">
                     <img src="https://picsum.photos/seed/discord/40" className="w-8 h-8 rounded-full" alt="Discord"/>
                     <p className="text-sm"><span className="font-bold text-white">Discord</span> is testing new community moderation tools.</p>
                     <span className="text-xs text-slate-500 ml-auto">1d ago</span>
                 </li>
             </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;