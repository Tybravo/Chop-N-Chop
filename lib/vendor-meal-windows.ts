// ============================================================
// Customer Ordering Window — shared chip options and the
// deterministic Delivery Window rule used by the vendor Meals
// screens (Add / Edit / View).
//
// The ordering window is persisted inside the dish `tags` array
// (a string), where the backend stores it and returns it back —
// e.g. ["Breakfast", "Spicy", "Halal"].
// ============================================================

/** Single-select customer ordering window options ("All-day" removed per PRD). */
export const CUSTOMER_ORDERING_WINDOW_OPTIONS = [
  "Breakfast",
  "Lunch",
  "Dinner",
] as const;

/** The selected ordering window of a dish, derived from its tags (case-insensitive). */
export const getCustomerOrderingWindow = (tags: string[] | undefined): string => {
  const list = tags || [];
  return (
    CUSTOMER_ORDERING_WINDOW_OPTIONS.find((window) =>
      list.some((tag) => tag.trim().toLowerCase() === window.toLowerCase())
    ) || ""
  );
};

/** Normalises "45 minutes", "2 hours", "2hrs" into decimal hours. */
const parsePreparationHours = (preparationTime: string): number => {
  if (!preparationTime) return 0;
  const match = preparationTime
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)\b/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2][0]; // 'h' or 'm'
  return unit === "m" ? value / 60 : value;
};

/**
 * Deterministic Delivery Window rule.
 *
 * Maps the vendor-selected Customer Ordering Window + the meal's preparation
 * time to the delivery window the customer receives:
 *
 *                    < 3h                 4–7h                  7–13h                 13–24h
 *   Breakfast:   Today's Breakfast   | Today's Launch      | Today's Dinner       | Tomorrow's Breakfast
 *   Lunch:       Today's Launch      | Today's Dinner      | Tomorrow's Breakfast | Tomorrow's Launch
 *   Dinner:      Today's Dinner      | Tomorrow's Breakfast| Tomorrow's Launch   | Tomorrow's Dinner
 */
export const getDeliveryWindow = (
  orderingWindow: string,
  preparationTime: string
): string => {
  const hours = parsePreparationHours(preparationTime);
  const slotIndex = hours < 3 ? 0 : hours < 7 ? 1 : hours < 13 ? 2 : 3;
  switch (orderingWindow) {
    case "Breakfast":
      return ["Today's Breakfast", "Today's Launch", "Today's Dinner", "Tomorrow's Breakfast"][slotIndex];
    case "Lunch":
      return ["Today's Launch", "Today's Dinner", "Tomorrow's Breakfast", "Tomorrow's Launch"][slotIndex];
    case "Dinner":
      return ["Today's Dinner", "Tomorrow's Breakfast", "Tomorrow's Launch", "Tomorrow's Dinner"][slotIndex];
    default:
      return "";
  }
};