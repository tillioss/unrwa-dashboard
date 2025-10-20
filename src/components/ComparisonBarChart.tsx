import React from "react";
import { useTranslation } from "react-i18next";
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

interface ComparisonBarChartProps {
  preData: {
    beginner: number;
    growth: number;
    expert: number;
  };
  postData: {
    beginner: number;
    growth: number;
    expert: number;
  };
  title?: string;
}

export default function ComparisonBarChart({
  preData,
  postData,
  title,
}: ComparisonBarChartProps) {
  const { t } = useTranslation();

  const chartData = [
    {
      name: t("data.beginner"),
      Pre: preData.beginner,
      Post: postData.beginner,
    },
    {
      name: t("data.growth"),
      Pre: preData.growth,
      Post: postData.growth,
    },
    {
      name: t("data.expert"),
      Pre: preData.expert,
      Post: postData.expert,
    },
  ];

  // Find the maximum value to set appropriate domain
  const maxValue = Math.max(
    preData.beginner,
    preData.growth,
    preData.expert,
    postData.beginner,
    postData.growth,
    postData.expert
  );

  return (
    <div className="space-y-4">
      {title && (
        <h5 className="text-sm font-medium text-gray-700 mb-3">{title}</h5>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
            <YAxis
              domain={[0, Math.max(1, Math.ceil(maxValue * 1.1))]}
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
              dataKey="Pre"
              fill="#ffe2e2"
              name="Pre"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Post"
              fill="#dbeafe"
              name="Post"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
