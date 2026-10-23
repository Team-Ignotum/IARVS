
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  Clock3,
  MessageCircle,
  Search,
  Send,
  UserRound,
} from "lucide-react";

import { AdminSidebar } from "@/components/Asidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

// ================= TYPES =================

type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved";

type SupportMessage = {
  id: string;
  sender: "student" | "admin";
  senderName: string;
  content: string;
  date: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  studentName: string;
  studentId: string;
  email: string;
  category: string;
  createdAt: string;
  status: TicketStatus;
  messages: SupportMessage[];
};

type TicketFilter = "All" | TicketStatus;

// ================= STORAGE KEYS =================

const SUPPORT_STORAGE_KEY =
  "iarvs-admin-support-demo";

const SUPPORT_READ_KEY =
  "iarvs-admin-support-read";

const SUPPORT_UPDATED_EVENT =
  "iarvs-support-updated";

// ================= SAMPLE DATA =================

const initialTickets: SupportTicket[] = [
  {
    id: "SUP-001",
    subject:
      "Unable to register for semester courses",
    studentName: "A. Perera",
    studentId: "STU001",
    email: "student001@university.edu",
    category: "Course Registration",
    createdAt: "2026-10-20",
    status: "Open",
    messages: [
      {
        id: "m1",
        sender: "student",
        senderName: "A. Perera",
        content:
          "I am unable to register for my semester courses. The system says I am not eligible, but I have completed the required prerequisites. Could you please help me?",
        date: "2026-10-20T09:30:00",
      },
    ],
  },
  {
    id: "SUP-002",
    subject:
      "Incorrect GPA displayed in student portal",
    studentName: "S. Fernando",
    studentId: "STU002",
    email: "student002@university.edu",
    category: "Academic Records",
    createdAt: "2026-10-19",
    status: "In Progress",
    messages: [
      {
        id: "m2",
        sender: "student",
        senderName: "S. Fernando",
        content:
          "My GPA appears to be incorrect in the student dashboard. Please check whether my latest examination results have been included.",
        date: "2026-10-19T11:15:00",
      },
      {
        id: "m3",
        sender: "admin",
        senderName: "Administrator",
        content:
          "Thank you for contacting support. We will review your academic records and update you.",
        date: "2026-10-19T13:00:00",
      },
    ],
  },
  {
    id: "SUP-003",
    subject:
      "Request for prerequisite override",
    studentName: "M. Silva",
    studentId: "STU003",
    email: "student003@university.edu",
    category: "Override Request",
    createdAt: "2026-10-18",
    status: "Open",
    messages: [
      {
        id: "m4",
        sender: "student",
        senderName: "M. Silva",
        content:
          "I would like to know how to request a prerequisite override for a course I need to complete this academic year.",
        date: "2026-10-18T14:20:00",
      },
    ],
  },
  {
    id: "SUP-004",
    subject:
      "Cannot access registration dashboard",
    studentName: "N. Kumara",
    studentId: "STU004",
    email: "student004@university.edu",
    category: "Technical Issue",
    createdAt: "2026-10-17",
    status: "Resolved",
    messages: [
      {
        id: "m5",
        sender: "student",
        senderName: "N. Kumara",
        content:
          "I cannot open my registration dashboard after logging in.",
        date: "2026-10-17T08:00:00",
      },
      {
        id: "m6",
        sender: "admin",
        senderName: "Administrator",
        content:
          "Please sign out and log in again. The reported issue has been resolved.",
        date: "2026-10-17T10:30:00",
      },
    ],
  },
];

// ================= HELPERS =================

function getStatusClass(
  status: TicketStatus
): string {
  switch (status) {
    case "Open":
      return (
        "bg-amber-50 text-amber-700 " +
        "dark:bg-amber-950 dark:text-amber-300"
      );

    case "In Progress":
      return (
        "bg-blue-50 text-blue-700 " +
        "dark:bg-blue-950 dark:text-blue-300"
      );

    case "Resolved":
      return (
        "bg-emerald-50 text-emerald-700 " +
        "dark:bg-emerald-950 dark:text-emerald-300"
      );
  }
}

function formatDate(date: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(date.includes("T")
      ? {
          hour: "numeric" as const,
          minute: "2-digit" as const,
        }
      : {}),
  });
}

function getReadMessageIds(): Set<string> {
  try {
    const saved = localStorage.getItem(
      SUPPORT_READ_KEY
    );

    if (!saved) {
      return new Set<string>();
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }

    return new Set(
      parsed.filter(
        (id): id is string =>
          typeof id === "string"
      )
    );
  } catch {
    return new Set<string>();
  }
}

function getUnreadCount(
  ticket: SupportTicket,
  readIds: Set<string>
): number {
  return ticket.messages.filter(
    (message) =>
      message.sender === "student" &&
      !readIds.has(message.id)
  ).length;
}

function notifySupportUpdated() {
  window.dispatchEvent(
    new Event(SUPPORT_UPDATED_EVENT)
  );
}

// ================= MAIN PAGE =================

export default function AdminSupportPage() {
  const [tickets, setTickets] =
    useState<SupportTicket[]>(initialTickets);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<TicketFilter>("All");

  const [reply, setReply] =
    useState("");

  const [
    showMobileDetail,
    setShowMobileDetail,
  ] = useState(false);

  const [loaded, setLoaded] =
    useState(false);

  const [readMessageIds, setReadMessageIds] =
    useState<Set<string>>(
      () => new Set<string>()
    );

  // ================= LOAD SAVED DATA =================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        SUPPORT_STORAGE_KEY
      );

      if (saved) {
        const parsed: unknown =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setTickets(
            parsed as SupportTicket[]
          );
        }
      }

      setReadMessageIds(
        getReadMessageIds()
      );
    } catch {
      // Use sample tickets if local data
      // cannot be restored.
    }

    setLoaded(true);
  }, []);

  // ================= SAVE SUPPORT DATA =================

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      localStorage.setItem(
        SUPPORT_STORAGE_KEY,
        JSON.stringify(tickets)
      );

      notifySupportUpdated();
    } catch {
      // Storage may be unavailable.
    }
  }, [tickets, loaded]);

  // ================= SELECTED TICKET =================

  const selectedTicket =
    tickets.find(
      (ticket) =>
        ticket.id === selectedId
    ) ?? null;

  // ================= FILTER REQUESTS =================

  const filteredTickets = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesFilter =
        filter === "All" ||
        ticket.status === filter;

      const searchableFields = [
        ticket.id,
        ticket.subject,
        ticket.studentName,
        ticket.studentId,
        ticket.email,
        ticket.category,
      ];

      const matchesSearch =
        !term ||
        searchableFields.some((value) =>
          value
            .toLowerCase()
            .includes(term)
        );

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [tickets, search, filter]);

  // ================= DASHBOARD COUNTS =================

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved"
  ).length;

  const totalUnreadCount =
    tickets.reduce(
      (count, ticket) =>
        count +
        getUnreadCount(
          ticket,
          readMessageIds
        ),
      0
    );

  // ================= OPEN AND MARK AS READ =================

  const selectTicket = (id: string) => {
    setSelectedId(id);
    setReply("");
    setShowMobileDetail(true);

    const ticket = tickets.find(
      (item) => item.id === id
    );

    if (!ticket) {
      return;
    }

    try {
      const readIds =
        getReadMessageIds();

      ticket.messages.forEach(
        (message) => {
          if (
            message.sender === "student"
          ) {
            readIds.add(message.id);
          }
        }
      );

      localStorage.setItem(
        SUPPORT_READ_KEY,
        JSON.stringify(
          [...readIds]
        )
      );

      setReadMessageIds(
        new Set(readIds)
      );

      notifySupportUpdated();
    } catch {
      // Continue opening the ticket even
      // if storage is unavailable.
    }
  };

  // ================= UPDATE STATUS =================

  const updateStatus = (
    status: TicketStatus
  ) => {
    if (!selectedTicket) {
      return;
    }

    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id ===
        selectedTicket.id
          ? {
              ...ticket,
              status,
            }
          : ticket
      )
    );
  };

  // ================= SEND ADMIN REPLY =================

  const sendReply = () => {
    const content = reply.trim();

    if (
      !selectedTicket ||
      !content
    ) {
      return;
    }

    const message: SupportMessage = {
      id:
        typeof crypto !== "undefined" &&
        "randomUUID" in crypto
          ? crypto.randomUUID()
          : `msg-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
      sender: "admin",
      senderName: "Administrator",
      content,
      date: new Date().toISOString(),
    };

    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id ===
        selectedTicket.id
          ? {
              ...ticket,
              status:
                ticket.status === "Open"
                  ? "In Progress"
                  : ticket.status,
              messages: [
                ...ticket.messages,
                message,
              ],
            }
          : ticket
      )
    );

    setReply("");
  };

  // ================= PAGE =================

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="min-w-0 bg-[#f4f5f7] dark:bg-slate-950">
        <main className="flex min-h-screen flex-col p-4 sm:p-6 lg:p-8">
          {/* PAGE HEADER */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CircleHelp size={16} />
              Administration / Support
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Student Support
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage student help requests,
              respond to messages and track
              support ticket progress.
            </p>
          </div>

          {/* SUPPORT SUMMARY */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {
                label: "Total Requests",
                value: tickets.length,
                icon: MessageCircle,
                color: "text-indigo-600",
              },
              {
                label: "Open Requests",
                value: openCount,
                icon: CircleHelp,
                color: "text-amber-600",
              },
              {
                label: "In Progress",
                value: progressCount,
                icon: Clock3,
                color: "text-blue-600",
              },
              {
                label: "Resolved",
                value: resolvedCount,
                icon: CheckCircle2,
                color: "text-emerald-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>

                    <Icon
                      size={19}
                      className={item.color}
                    />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* SUPPORT INBOX */}
          <div className="grid min-h-[650px] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)] dark:border-slate-700 dark:bg-slate-900">
            {/* LEFT: SUPPORT REQUESTS */}
            <section
              className={`min-w-0 border-slate-200 lg:border-r dark:border-slate-700 ${
                showMobileDetail
                  ? "hidden lg:block"
                  : ""
              }`}
            >
              <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Support Requests
                  </h2>

                  {totalUnreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                      {totalUnreadCount} unread
                    </span>
                  )}
                </div>

                {/* SEARCH */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search student or issue..."
                    aria-label="Search support requests"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* FILTERS */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    [
                      "All",
                      "Open",
                      "In Progress",
                      "Resolved",
                    ] as const
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFilter(item)
                      }
                      aria-pressed={
                        filter === item
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === item
                          ? "bg-[#183b68] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* REQUEST LIST */}
              <div className="max-h-[620px] overflow-y-auto">
                {filteredTickets.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No support requests found.
                  </p>
                ) : (
                  filteredTickets.map(
                    (ticket) => {
                      const unread =
                        getUnreadCount(
                          ticket,
                          readMessageIds
                        );

                      const lastMessage =
                        ticket.messages[
                          ticket.messages.length -
                            1
                        ];

                      return (
                        <button
                          key={ticket.id}
                          type="button"
                          onClick={() =>
                            selectTicket(
                              ticket.id
                            )
                          }
                          className={`w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                            selectedId ===
                            ticket.id
                              ? "bg-blue-50 dark:bg-blue-950/30"
                              : ""
                          }`}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {ticket.id}
                            </span>

                            <div className="flex items-center gap-2">
                              {unread > 0 && (
                                <span
                                  aria-label={`${unread} unread messages`}
                                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                                >
                                  {unread > 99
                                    ? "99+"
                                    : unread}
                                </span>
                              )}

                              <span
                                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusClass(
                                  ticket.status
                                )}`}
                              >
                                {
                                  ticket.status
                                }
                              </span>
                            </div>
                          </div>

                          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                            {ticket.subject}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <UserRound
                              size={14}
                            />

                            {
                              ticket.studentName
                            }

                            <span>•</span>

                            {
                              ticket.studentId
                            }
                          </div>

                          <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                            {lastMessage?.content ??
                              "No messages yet."}
                          </p>

                          <p className="mt-2 text-[11px] text-slate-400">
                            {formatDate(
                              ticket.createdAt
                            )}
                          </p>
                        </button>
                      );
                    }
                  )
                )}
              </div>
            </section>

            {/* RIGHT: CONVERSATION */}
            <section
              className={`flex min-w-0 flex-col ${
                !showMobileDetail
                  ? "hidden lg:flex"
                  : ""
              }`}
            >
              {!selectedTicket ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="mb-4 rounded-full bg-blue-50 p-5 dark:bg-blue-950">
                    <MessageCircle
                      size={32}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Select a Support Request
                  </h2>

                  <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Choose a student request
                    from the inbox to view
                    the conversation and
                    send a reply.
                  </p>
                </div>
              ) : (
                <>
                  {/* CONVERSATION HEADER */}
                  <div className="border-b border-slate-200 p-5 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() =>
                        setShowMobileDetail(
                          false
                        )
                      }
                      className="mb-3 flex items-center gap-2 text-sm text-blue-600 lg:hidden"
                    >
                      <ArrowLeft
                        size={16}
                      />
                      Back to Requests
                    </button>

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {
                            selectedTicket.subject
                          }
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {
                            selectedTicket.id
                          }{" "}
                          •{" "}
                          {
                            selectedTicket.category
                          }
                        </p>
                      </div>

                      {/* STATUS SELECT */}
                      <select
                        aria-label="Support request status"
                        value={
                          selectedTicket.status
                        }
                        onChange={(event) =>
                          updateStatus(
                            event.target
                              .value as TicketStatus
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Open">
                          Open
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>
                      </select>
                    </div>

                    {/* STUDENT DETAILS */}
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <span>
                        <strong>
                          Student:
                        </strong>{" "}
                        {
                          selectedTicket.studentName
                        }
                      </span>

                      <span>
                        <strong>
                          ID:
                        </strong>{" "}
                        {
                          selectedTicket.studentId
                        }
                      </span>

                      <span>
                        <strong>
                          Email:
                        </strong>{" "}
                        {
                          selectedTicket.email
                        }
                      </span>
                    </div>
                  </div>

                  {/* MESSAGE HISTORY */}
                  <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 p-5 dark:bg-slate-950/40">
                    {selectedTicket.messages.map(
                      (message) => {
                        const isAdmin =
                          message.sender ===
                          "admin";

                        return (
                          <div
                            key={
                              message.id
                            }
                            className={`flex ${
                              isAdmin
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[90%] rounded-2xl border p-4 shadow-sm sm:max-w-[80%] ${
                                isAdmin
                                  ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                              }`}
                            >
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                                  <UserRound
                                    size={15}
                                  />
                                </div>

                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {
                                    message.senderName
                                  }
                                </span>

                                <span className="text-[11px] text-slate-400">
                                  {formatDate(
                                    message.date
                                  )}
                                </span>
                              </div>

                              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
                                {
                                  message.content
                                }
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* REPLY SECTION */}
                  <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <label
                      htmlFor="admin-support-reply"
                      className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                      Reply to Student
                    </label>

                    <textarea
                      id="admin-support-reply"
                      value={reply}
                      onChange={(event) =>
                        setReply(
                          event.target.value
                        )
                      }
                      placeholder="Type your response to the student..."
                      rows={4}
                      className="w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Replies are stored
                        locally for this
                        frontend demo.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {selectedTicket.status !==
                          "Resolved" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                "Resolved"
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                          >
                            <CheckCircle2
                              size={16}
                            />
                            Mark Resolved
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={
                            sendReply
                          }
                          disabled={
                            !reply.trim()
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#183b68] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#102d52] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700"
                        >
                          <Send
                            size={16}
                          />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
