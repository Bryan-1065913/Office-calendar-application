// src/components/common/Dashboard/ProfileOverviewCard.tsx
import "../../../styles/Dashboard/ProfileOverviewCard.css";
import { useAuth } from "../../../authentication/AuthContext";

const ProfileOverviewCard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="alert alert-info">Loading profile...</div>;
    }

    return (
        <div className="profile-card shadow-sm">
            <h5 className="profile-title">My profile</h5>

            <div className="profile-header">
                <h3 className="profile-name">
                    {user.firstName} {user.lastName}
                </h3>
                <span className="role-badge">{user.role}</span>
            </div>

            <div className="profile-field">
                <label>Email address</label>
                <p>{user.email}</p>
            </div>

            <div className="profile-field">
                <label>Phone number</label>
                <p>{user.phoneNumber}</p>
            </div>

            <div className="profile-field">
                <label>Function</label>
                <p>{user.jobTitle}</p>
            </div>
        </div>
    );
};

export default ProfileOverviewCard;