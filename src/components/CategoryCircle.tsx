import { useTranslation } from "react-i18next";

interface CategoryCircleProps {
  category: "beginner" | "learner" | "expert";
  count: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function CategoryCircle({
  category,
  count,
  size = "md",
  showLabel = true,
  className = "",
}: CategoryCircleProps) {
  const { t } = useTranslation();
  const getCategoryColors = (category: string) => {
    switch (category) {
      case "beginner":
        return {
          background: "bg-[#FEE2E2]",
          text: "text-[#EF4444]",
        };
      case "learner":
        return {
          background: "bg-[#DBEAFE]",
          text: "text-[#3B82F6]",
        };
      case "expert":
        return {
          background: "bg-[#DCFCE7]",
          text: "text-[#22C55E]",
        };
      default:
        return {
          background: "bg-gray-500",
          text: "text-white",
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "w-12 h-12 text-sm";
      case "md":
        return "w-16 h-16 text-lg";
      case "lg":
        return "w-20 h-20 text-xl";
      default:
        return "w-16 h-16 text-lg";
    }
  };

  const getLabelSize = (size: string) => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const colors = getCategoryColors(category);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`${getSizeClasses(size)} rounded-full ${colors.background} ${
          colors.text
        } flex items-center justify-center font-medium mb-2`}
      >
        {count}
      </div>
      {showLabel && (
        <span className={`font-medium text-gray-700 ${getLabelSize(size)}`}>
          {t(category)}
        </span>
      )}
    </div>
  );
}
