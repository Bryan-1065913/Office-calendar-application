// Profile.tsx
import { useState } from "react";
import { useAuth } from "../../../authentication/AuthContext";
import "../../../styles/Profile/Profile.css";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phoneNumber || "",
        location: user?.location || "",
        department: user?.jobTitle || "",
    });

    if (!user) return <div>Loading...</div>;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        try {
            await updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phoneNumber: form.phone,
                location: form.location,
                jobTitle: form.department,
            });

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Verbeterde formatDate functie
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Not available';

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Ongeldige datum';
            }

            return date.toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Fout bij formatteren';
        }
    };

    return (
        <div className="profile-container">
            {/* === LEFT IMAGE + BUTTON === */}
            <div className="profile-left">
                <div className="profile-photo"></div>

                {isEditing && (
                    <button className="btn-edit-photo">Edit photo</button>
                )}
            </div>

            {/* === RIGHT SIDE CONTENT === */}
            <div className="profile-right">

                {/* === NAME + ROLE BADGE === */}
                {!isEditing ? (
                    <div className="profile-top">
                        <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
                        <span className="role-badge">{user.role}</span>
                    </div>
                ) : (
                    <div className="input-group">
                        <div className="input-block">
                            <label>First Name</label>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={onChange}
                            />
                        </div>
                        <div className="input-block">
                            <label>Last Name</label>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                )}

                <div className="info-wrapper">
                    {/* LEFT COLUMN */}
                    <div className="info-section">
                        <h3>Contact information</h3>

                        {/* EMAIL */}
                        <div className="info-item">
                            <label>Email address</label>
                            {!isEditing ? (
                                <p>{user.email}</p>
                            ) : (
                                <input name="email" value={form.email} onChange={onChange} />
                            )}
                        </div>

                        {/* PHONE */}
                        <div className="info-item">
                            <label>Phone number</label>
                            {!isEditing ? (
                                <p>{user.phoneNumber || 'Not provided'}</p>
                            ) : (
                                <input name="phone" value={form.phone} onChange={onChange} />
                            )}
                        </div>

                        {/* LOCATION */}
                        <div className="info-item">
                            <label>Location</label>
                            {!isEditing ? (
                                <p>{user.location || 'Not provided'}</p>
                            ) : (
                                <input name="location" value={form.location} onChange={onChange} />
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="info-section">
                        <h3>Account information</h3>

                        <div className="info-item">
                            <label>Member since</label>
                            <p>{formatDate(user.createdAt)}</p>
                        </div>

                        <div className="info-item">
                            <label>Last updated</label>
                            <p>{formatDate(user.updatedAt)}</p>
                        </div>

                        <div className="info-item">
                            <label>Function</label>

                            {!isEditing ? (
                                <p>{user.jobTitle || 'Not assigned'}</p>
                            ) : (
                                <select name="department" value={form.department} onChange={onChange}>
                                    <option value="">Select department</option>
                                    <option value="Development">Development</option>
                                    <option value="Support">Support</option>
                                    <option value="Management">Management</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* === BUTTONS === */}
                {!isEditing ? (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>
                        Edit profile
                    </button>
                ) : (
                    <div className="edit-buttons">
                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-save" onClick={saveChanges}>Save</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;