"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts"

interface CompareChartsProps {
  item1Name: string;
  item2Name: string;
  item1Score: number;
  item2Score: number;
  features: {
    name: string;
    item1Value: number | string;
    item2Value: number | string;
  }[];
}

export function CompareCharts({
  item1Name,
  item2Name,
  item1Score,
  item2Score,
  features
}: CompareChartsProps) {
  // 1. Setup overall score data
  const overallData = [
    { name: item1Name, score: item1Score, color: "#111827" },
    { name: item2Name, score: item2Score, color: "#6b7280" }
  ];

  // 2. Setup comparative features data (filtering for numeric feature values)
  const numericFeatures = features
    .filter(f => {
      const val1 = Number(f.item1Value);
      const val2 = Number(f.item2Value);
      return !isNaN(val1) && !isNaN(val2);
    })
    .map(f => ({
      name: f.name,
      [item1Name]: Number(f.item1Value),
      [item2Name]: Number(f.item2Value)
    }));

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Overall Score Chart */}
      <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:translate-y-[-2px]">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Overall Score Comparison
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overallData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" domain={[0, 100]} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: "8px" }}
                itemStyle={{ color: "#111827", fontWeight: "600" }}
                labelStyle={{ color: "#6b7280" }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {overallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Breakdown Chart */}
      <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:translate-y-[-2px]">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Feature Benchmark Ratings
        </h3>
        <div className="h-64 w-full">
          {numericFeatures.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={numericFeatures} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px", color: "#111827", fontWeight: "600" }}
                  labelStyle={{ color: "#6b7280" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey={item1Name} fill="#111827" radius={[2, 2, 0, 0]} />
                <Bar dataKey={item2Name} fill="#6b7280" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">
              No comparative numeric features available to visualize.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
