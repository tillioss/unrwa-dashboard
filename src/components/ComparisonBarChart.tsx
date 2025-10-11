import React from "react";
import { useTranslation } from "react-i18next";

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

  // Find the maximum value to scale the bars
  const maxValue = Math.max(
    preData.beginner,
    preData.growth,
    preData.expert,
    postData.beginner,
    postData.growth,
    postData.expert
  );

  // Add some padding to the scale (10% more than max)
  const scale = maxValue * 1.1 || 1;

  const getBarWidth = (value: number) => {
    return `${(value / scale) * 100}%`;
  };

  return (
    <div className="space-y-4">
      {title && (
        <h5 className="text-sm font-medium text-gray-700 mb-3">{title}</h5>
      )}

      {/* Legend */}
      <div className="flex gap-4 items-center text-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#ffe2e2] rounded"></div>
          <span className="text-gray-600">Pre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#dbeafe] rounded"></div>
          <span className="text-gray-600">Post</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-6">
        {/* Beginner */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 w-20">
              {t("data.beginner")}
            </span>
          </div>
          <div className="space-y-2">
            {/* Pre bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#ffe2e2] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(preData.beginner) }}
                >
                  {preData.beginner > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {preData.beginner}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Post bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#dbeafe] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(postData.beginner) }}
                >
                  {postData.beginner > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {postData.beginner}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 w-20">
              {t("data.growth")}
            </span>
          </div>
          <div className="space-y-2">
            {/* Pre bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#ffe2e2] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(preData.growth) }}
                >
                  {preData.growth > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {preData.growth}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Post bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#dbeafe] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(postData.growth) }}
                >
                  {postData.growth > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {postData.growth}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expert */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 w-20">
              {t("data.expert")}
            </span>
          </div>
          <div className="space-y-2">
            {/* Pre bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#ffe2e2] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(preData.expert) }}
                >
                  {preData.expert > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {preData.expert}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Post bar */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-100 rounded h-6 relative overflow-hidden">
                <div
                  className="bg-[#dbeafe] h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getBarWidth(postData.expert) }}
                >
                  {postData.expert > 0 && (
                    <span className="text-xs font-medium text-gray-700">
                      {postData.expert}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* X-axis scale */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 pl-20">
        <span>0</span>
        <span>{Math.round(scale / 2)}</span>
        <span>{Math.round(scale)}</span>
      </div>
    </div>
  );
}
