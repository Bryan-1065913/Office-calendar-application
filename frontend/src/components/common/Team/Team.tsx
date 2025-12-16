import "../../../styles/Dashboard/TeamPage.css";
import { useEffect, useMemo, useState, useRef } from "react";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";
import {
  workStatusService,
  type WorkStatus,
} from "../../../services/workStatusService";
import Calendar from "../Calendar/Calendar";
import Button from "../UI/Buttons";
import { StatusBadge } from "../UI/StatusBadge";
import Chevron from "../../../assets/icons/chevron.svg?react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_API || "http://localhost:5017/api";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function mapStatusLabel(status: string) {
  const map: Record<string, string> = {
    office: "Office",
    home: "Home",
    vacation: "Leave", // vacation maps to "Leave"
    sick: "Sick",
    business_trip: "Other", // business_trip maps to "Other"
    other: "Other",
  };
  return map[status] || status;
}

function mapStatusToBadgeVariant(
  status: string | null
): "office" | "home" | "leave" | "sick" | "off" {
  if (!status) return "off";
  switch (status) {
    case "home":
      return "home";
    case "vacation":
      return "leave"; // Day off/Holiday uses leave variant
    case "sick":
      return "sick";
    case "business_trip":
      return "off"; // business_trip uses off variant
    default:
      return "office";
  }
}

const Team = () => {
  const [dayStatuses, setDayStatuses] = useState<WorkStatus[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(""); // Empty = no filter
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => formatDate(new Date()), []);

  const {
    data2: users,
    isLoading2,
    error2,
  } = useFetchSecond<User[]>({
    url: `${API_BASE_URL}/users`,
  });

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const result = await workStatusService.getDayWorkStatus(today);
        setDayStatuses(result);
      } catch (e) {
        console.error("Failed to load day work status", e);
      }
    };

    loadStatuses();
  }, [today]);

  const getStatusForUser = (userId: number) => {
    const status = dayStatuses.find((s) => s.userId === userId);
    return status ? status.status : null;
  };

  // Filter users based on selected status
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!statusFilter) return users; // "No filter" shows all users

    // Map filter values to backend status values
    const statusMapping: Record<string, string[]> = {
      office: ["office"],
      home: ["home"],
      leave: ["vacation"], // Map "Leave" to vacation
      sick: ["sick"],
      holiday: ["vacation"], // Map "Holiday" to vacation
      other: ["other"],
    };

    const backendStatuses = statusMapping[statusFilter] || [];

    // Create a map of userId -> status for efficient lookup
    const statusMap = new Map<number, string | null>();
    users.forEach((u) => {
      const status = dayStatuses.find((s) => s.userId === u.id);
      statusMap.set(u.id, status ? status.status : null);
    });

    return users.filter((u) => {
      const userStatus = statusMap.get(u.id);
      return userStatus && backendStatuses.includes(userStatus);
    });
  }, [users, dayStatuses, statusFilter]);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { value: "", label: "No filter" },
    { value: "office", label: "Office" },
    { value: "home", label: "Home" },
    { value: "leave", label: "Leave" },
    { value: "sick", label: "Sick" },
    { value: "holiday", label: "Holiday" },
    { value: "other", label: "Other" },
  ];

  const selectedFilterLabel =
    filterOptions.find((opt) => opt.value === statusFilter)?.label ||
    "No filter";

  if (isLoading2) return <p>Loading team...</p>;
  if (error2) return <p>Error loading team: {error2}</p>;

  // No user selected: show full-width team overview
  if (!selectedUserId) {
    return (
      <div className="team-page">
        <div className="team-card">
          <div className="team-header">
            <h2 className="team-title">Team</h2>
            <div
              ref={filterDropdownRef}
              className="team-filter-wrapper"
              data-open={filterDropdownOpen}
            >
              <Button
                variant="dropdown"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="team-filter-button"
              >
                {selectedFilterLabel}
              </Button>
              {filterDropdownOpen && (
                <div className="team-filter-dropdown">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`team-filter-option ${
                        statusFilter === option.value ? "active" : ""
                      }`}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setFilterDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="team-list">
            {filteredUsers.length === 0 ? (
              <div className="team-no-results">
                No team members found with the selected status.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const status = getStatusForUser(u.id);
                const label = status ? mapStatusLabel(status) : "No status";
                const badgeVariant = mapStatusToBadgeVariant(status);

                return (
                  <button
                    key={u.id}
                    className="team-member-row"
                    type="button"
                    onClick={() => handleSelectUser(u.id)}
                  >
                    <div className="team-member-left">
                      <div className="avatar" />
                      <div className="team-member-info">
                        <span className="team-member-name">
                          {u.firstName} {u.lastName}
                        </span>
                        <span className="team-member-department">
                          {u.jobTitle || "Development"}
                        </span>
                      </div>
                    </div>
                    <div className="team-member-right">
                      <StatusBadge label={label} variant={badgeVariant} />
                      <Chevron className="team-member-chevron" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // User selected: show full-width calendar with back button
  return (
    <div className="team-page">
      <button
        type="button"
        className="back-to-team"
        onClick={() => setSelectedUserId(null)}
      >
        &lt; Back to team
      </button>
      <Calendar viewUserId={selectedUserId} />
    </div>
  );
};

export default Team;
