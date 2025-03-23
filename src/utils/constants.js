export const STATUS_LABELS = {
  open: "Open",
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const STATUS_BADGES = {
  open: "badge-error",
  pending: "badge-warning",
  in_progress: "badge-info",
  resolved: "badge-success",
  closed: "badge-neutral",
};

export const TICKET_STATUSES = {
  open: "🛠️ Open",
  pending: "⏳ Pending",
  in_progress: "🚧 In Progress",
  resolved: "✅ Resolved",
  closed: "🔒 Closed",
};

export const TICKET_TYPES = {
  service_request: "📝 Service Request",
  change_request: "🔧 Change Request",
  incident: "⚠️ Incident",
};

export const TICKET_TYPE_BADGE_CLASSES = {
  service_request: "badge-info badge-soft",
  change_request: "badge-warning badge-soft",
  incident: "badge-error badge-soft",
};

export const TICKET_PRIORITIES = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const TICKET_PRIORITY_CLASSES = {
  low: "status-success",
  medium: "status-warning",
  high: "status-error",
};
