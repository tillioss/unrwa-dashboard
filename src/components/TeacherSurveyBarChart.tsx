import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TeacherSurveyBarChartProps {
  preData: Record<string, number>;
  postData: Record<string, number>;
  labels: Record<string, string>;
  skillName: string;
}

export default function TeacherSurveyBarChart({
  preData,
  postData,
  labels,
  skillName,
}: TeacherSurveyBarChartProps) {
  const allKeys = Object.keys(labels).sort();

  const chartData = allKeys.map((key) => ({
    name: labels[key] || `Option ${key}`,
    "Pre test": preData[key] || 0,
    "Post test": postData[key] || 0,
  }));

  const maxValue = Math.max(
    ...Object.values(preData),
    ...Object.values(postData),
    1
  );

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 mb-1">{skillName}</h4>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={50}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis
              domain={[0, Math.max(1, Math.ceil(maxValue))]}
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Bar
              dataKey="Pre test"
              fill="#7de1ea"
              name="Pre test"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Post test"
              fill="#1fb6d4"
              name="Post test"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* X-axis label */}
      <div className="pt-3 text-sm text-gray-700 text-center">
        Responses to the questions
      </div>
    </div>
  );
}
