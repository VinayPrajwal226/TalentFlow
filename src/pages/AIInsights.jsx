import { useEffect, useState } from "react";
import { insightsDb } from "../services/db/insightsDb";

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [metrics, setMetrics] = useState({
    hiring: null,
    dropout: null,
    conversion: null,
    timeToHire: 0,
    assessment: null,
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      
      const [summary, hiring, dropout, conversion, timeToHire, assessment] = 
        await Promise.all([
          insightsDb.generateInsightsSummary(),
          insightsDb.getHiringMetrics("month"),
          insightsDb.getStageDropoutAnalysis(),
          insightsDb.getConversionRates(),
          insightsDb.getTimeToHire(),
          insightsDb.getAssessmentMetrics(),
        ]);
      
      setInsights(summary);
      setMetrics({ hiring, dropout, conversion, timeToHire, assessment });
    } catch (error) {
      console.error("Error loading insights:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Insights Dashboard</h1>
      
 
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === "success"
                  ? "bg-green-50 border-green-500"
                  : insight.type === "warning"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <p className="text-gray-800">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Hired"
          value={metrics.hiring?.totalHired || 0}
          subtitle="this month"
          icon="👥"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversion?.conversionRate || 0}%`}
          subtitle={`${metrics.conversion?.totalHired}/${metrics.conversion?.totalApplied} hired`}
          icon="📈"
        />
        <MetricCard
          title="Avg Time to Hire"
          value={`${metrics.timeToHire} days`}
          subtitle="from application"
          icon="⏱️"
        />
        <MetricCard
          title="Assessment Completion"
          value={`${metrics.assessment?.completionRate || 0}%`}
          subtitle={`${metrics.assessment?.totalResponses || 0} responses`}
          icon="📝"
        />
      </div>

    
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Candidate Stage Distribution</h3>
        <div className="space-y-3">
          {metrics.dropout?.stageDistribution &&
            Object.entries(metrics.dropout.stageDistribution).map(([stage, count]) => (
              <div key={stage} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 capitalize">{stage}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full flex items-center justify-end px-2 text-white text-xs font-semibold"
                    style={{
                      width: `${(count / metrics.conversion?.totalApplied * 100) || 0}%`,
                      minWidth: count > 0 ? "40px" : "0",
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>


      {metrics.hiring?.hiredByRole && Object.keys(metrics.hiring.hiredByRole).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Hires by Role (This Month)</h3>
          <div className="space-y-2">
            {Object.entries(metrics.hiring.hiredByRole)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count]) => (
                <div key={role} className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">{role}</span>
                  <span className="font-semibold text-blue-600">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
  </div>
);

export default AIInsights;
