// src/components/common/Dashboard/TeamOverviewCard.tsx
import "../../../styles/Dashboard/TeamOverviewCard.css";

type TeamMember = {
    name: string;
    status: "office" | "home" | "leave" | "sick";
};

const members: TeamMember[] = [
    { name: "Alice Jansen", status: "office" },
    { name: "Sophie Kuiper", status: "office" },
    { name: "Bob de Vries", status: "office" },
    { name: "Martijn Visser", status: "leave" },
    { name: "Eva Bakker", status: "home" },
    { name: "Jos de Jong", status: "sick" },
];

const TeamOverviewCard = () => {
    return (
        <div className="team-card">
            <h5 className="team-title">Team</h5>

            <div className="team-grid">
                {members.map((m) => (
                    <div key={m.name} className="team-row">
                        <div className="avatar" />
                        <span className="name">{m.name}</span>

                        <div className="status">
                            <span className={`dot ${m.status}`} />
                            <span className="status-text">{capitalize(m.status)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default TeamOverviewCard;