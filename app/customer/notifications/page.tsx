"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Package,
  Truck,
  CreditCard,
  Bell,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

type NotificationCategory = "all" | "orders" | "deliveries" | "payments" | "system";
type DateGroup = "today" | "earlier";

interface InAppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  dateGroup: DateGroup;
  link: string;
}

const tabs: Array<{ id: NotificationCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "orders", label: "Orders" },
  { id: "deliveries", label: "Deliveries" },
  { id: "payments", label: "Payments" },
  { id: "system", label: "System" },
];

const initialNotifications: InAppNotification[] = [
  {
    id: "n1",
    category: "deliveries",
    title: "Rider is Approaching!",
    body: "Your drop from Taste & See is 2 minutes away from the Victoria Island Hub.",
    time: "2 mins ago",
    isRead: false,
    dateGroup: "today",
    link: "/customer/drops",
  },
  {
    id: "n2",
    category: "orders",
    title: "Order Ready for Pickup",
    body: "Your Drop meal is ready at the Yaba Hub. Show your pickup code: 492X1.",
    time: "1 hour ago",
    isRead: false,
    dateGroup: "today",
    link: "/customer/drops",
  },
  {
    id: "n3",
    category: "payments",
    title: "Wallet Funded Successfully",
    body: "₦10,000 has been added to your ChopNChop wallet via Bank Transfer.",
    time: "4 hours ago",
    isRead: true,
    dateGroup: "today",
    link: "/customer/wallet",
  },
  {
    id: "n4",
    category: "system",
    title: "New Feature: Multi-Hub Saving",
    body: "You can now save multiple office and home delivery hubs for faster checkout.",
    time: "Yesterday at 4:30 PM",
    isRead: true,
    dateGroup: "earlier",
    link: "/customer/locations",
  },
  {
    id: "n5",
    category: "payments",
    title: "Payment Failed",
    body: "Your card ending in 4242 was declined for Order #ORD-9104. Please update your payment method.",
    time: "Sep 15 at 1:15 PM",
    isRead: true,
    dateGroup: "earlier",
    link: "/customer/wallet",
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState<InAppNotification[]>(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)),
    );
  };

  const openNotification = (notification: InAppNotification) => {
    markAsRead(notification.id);
    router.push(notification.link);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.category === activeTab,
  );
  const todayNotifs = filteredNotifications.filter((notification) => notification.dateGroup === "today");
  const earlierNotifs = filteredNotifications.filter(
    (notification) => notification.dateGroup === "earlier",
  );
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "All";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-[112px] md:pb-16">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="p-2 -ml-2 rounded-full text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:text-white dark:hover:bg-zinc-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="flex min-w-0 items-center gap-2 text-[18px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              <span className="truncate">Notifications</span>
              {unreadCount > 0 && (
                <span className="shrink-0 rounded-full bg-[#FC6B31] px-2 py-0.5 text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/customer/settings")}
            aria-label="Open notification settings"
            className="p-2 -mr-2 rounded-full text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Notification categories"
          onKeyDown={handleTabKeyDown}
          className="flex w-full min-w-0 snap-x gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          <div className="w-1 shrink-0 snap-start" />
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] ${
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <div className="w-1 shrink-0" />
        </div>
      </header>

      <div aria-live="polite" className="mx-auto w-full max-w-3xl px-4 pt-6">
        {unreadCount > 0 && (
          <div className="-mb-4 flex justify-end">
            <button
              type="button"
              onClick={markAllAsRead}
              aria-label={`Mark all ${unreadCount} unread notifications as read`}
              className="flex items-center gap-1 text-[12px] font-bold text-[#FC6B31] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark all as read
            </button>
          </div>
        )}

        {todayNotifs.length > 0 && (
          <section className="space-y-3" aria-labelledby="today-notifications-heading">
            <h2 id="today-notifications-heading" className="text-[14px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              Today
            </h2>
            <div className="divide-y divide-gray-50 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm dark:divide-zinc-800/50 dark:border-zinc-800 dark:bg-zinc-900">
              {todayNotifs.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  data={notification}
                  onRead={markAsRead}
                  onClick={() => openNotification(notification)}
                  config={getIconConfig(notification.category, notification.title)}
                />
              ))}
            </div>
          </section>
        )}

        {earlierNotifs.length > 0 && (
          <section className="space-y-3" aria-labelledby="earlier-notifications-heading">
            <h2 id="earlier-notifications-heading" className="text-[14px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              Earlier
            </h2>
            <div className="divide-y divide-gray-50 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm dark:divide-zinc-800/50 dark:border-zinc-800 dark:bg-zinc-900">
              {earlierNotifs.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  data={notification}
                  onRead={markAsRead}
                  onClick={() => openNotification(notification)}
                  config={getIconConfig(notification.category, notification.title)}
                />
              ))}
            </div>
          </section>
        )}

        {filteredNotifications.length === 0 && (
          <div role="status" className="flex w-full flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-900">
              <Bell className="h-8 w-8 text-gray-300 dark:text-zinc-700" />
            </div>
            <h3 className="mb-1 text-[15px] font-bold text-gray-900 dark:text-white">
              {activeTab === "all" ? "No notifications" : `No ${activeTabLabel.toLowerCase()} notifications`}
            </h3>
            <p className="text-[13px] text-gray-500">
              {activeTab === "all"
                ? "You're all caught up! Check back later."
                : "This category is clear. View every notification instead."}
            </p>
            {activeTab !== "all" && (
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="mt-4 rounded-full bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:bg-white dark:text-zinc-900"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getIconConfig(category: NotificationCategory, title: string) {
  if (category === "deliveries") {
    return { Icon: Truck, bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-600 dark:text-blue-400" };
  }
  if (category === "orders") {
    return { Icon: Package, bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-[#FC6B31]" };
  }
  if (category === "payments") {
    const isError = title.toLowerCase().includes("failed");
    return {
      Icon: CreditCard,
      bg: isError ? "bg-red-100 dark:bg-red-900/40" : "bg-emerald-100 dark:bg-emerald-900/40",
      text: isError ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
    };
  }
  return { Icon: Bell, bg: "bg-gray-100 dark:bg-zinc-800", text: "text-gray-600 dark:text-gray-300" };
}

function NotificationCard({
  data,
  config,
  onRead,
  onClick,
}: {
  data: InAppNotification;
  config: { Icon: LucideIcon; bg: string; text: string };
  onRead: (id: string) => void;
  onClick: () => void;
}) {
  const { Icon, bg, text } = config;

  return (
    <article
      className={`relative p-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50 ${
        !data.isRead ? "bg-orange-50/30 dark:bg-orange-900/10" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`Open notification: ${data.title}`}
        onClick={onClick}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
      />
      <div className="pointer-events-none relative z-10 flex gap-3.5">
        <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 pr-2">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3
              className={`truncate pr-2 text-[14px] leading-tight ${
                !data.isRead
                  ? "font-extrabold text-gray-900 dark:text-white"
                  : "font-bold text-gray-700 dark:text-gray-200"
              }`}
            >
              {data.title}
            </h3>
            <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-gray-400">{data.time}</span>
          </div>
          <p
            className={`line-clamp-2 text-[13px] leading-snug ${
              !data.isRead
                ? "font-medium text-gray-600 dark:text-gray-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {data.body}
          </p>
          {!data.isRead && (
            <div className="mt-2.5">
              <button
                type="button"
                aria-label={`Mark ${data.title} as read`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRead(data.id);
                }}
                className="pointer-events-auto relative z-10 text-[11px] font-extrabold text-[#FC6B31] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
              >
                Mark as read
              </button>
            </div>
          )}
        </div>
        {!data.isRead && (
          <div className="pointer-events-none absolute top-5 right-4 h-2 w-2 rounded-full bg-[#FC6B31] shadow-sm shadow-orange-500/30" />
        )}
      </div>
    </article>
  );
}
