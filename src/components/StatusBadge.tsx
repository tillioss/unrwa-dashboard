interface StatusBadgeProps {
  status: "completed" | "ongoing" | "pending";
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-100 text-success-600";
      case "ongoing":
        return "bg-primary-100 text-primary-600";
      case "pending":
        return "bg-secondary-100 text-secondary-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
