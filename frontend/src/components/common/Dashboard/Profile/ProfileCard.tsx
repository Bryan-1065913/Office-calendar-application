import { useState } from "react";
import { useAuth } from "../../../../authentication/AuthContext";

const API_URL = "http://localhost:5017/api";

const ProfileCard = () => {
    // check user auth
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        jobTitle: user?.jobTitle || "",
    });

    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [succesMessage, setSuccesMessage] = useState("");

    if (!user) {
        return <div className="alert alert-info">Loading profiel...</div>;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(preview => ({
            ...preview,
            [name]: value
        }));
    }

    const handleSave = async () => {
        console.log("save!");
        setIsSaving(true);
        setError("");
        
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("You are not logged in!");
            }

            const response = await fetch(`${API_URL}/profile`,  {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            console.log(token);

            console.log("status", response.status);

            let responseData;
            try {
                responseData = await response.json();
                console.log("Response data in try", responseData);
            } catch (parseError) {
                // Response is geen JSON, dus het is een exception
                const errorText = await response.text();
                console.log("Raw error response:", errorText); 
                console.log("failed to parse json", parseError)
                setError("Backend error:");
                return;
            }

            if (!response.ok){
                throw new Error(responseData.message || "Error with saving profile");
            }

            //Update local storage with new user data
            localStorage.setItem('user', JSON.stringify(responseData.user));

            setSuccesMessage("Profile has been updated");
            setIsEditing(false);

            setTimeout(() => setSuccesMessage(""), 3000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error with updating";
            setError(errorMessage);
            // setError("Error with updating");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            jobTitle: user.jobTitle,
        });
        setIsEditing(false);
    }

    return (
        <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold">My Profile</h6>
                {!isEditing && (
                    <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}
                    >Change Profile</button>
                    
                )}
            </div>

            {/* //Error display */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            {succesMessage && (
                <div className="alert alert-succes alert-dismissable fade show">
                    {succesMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccesMessage("")}></button>
                </div>
            )}

            {!isEditing ? (
                // VIEW MODE
                <div className="profile-info">

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Firstname and lastname</strong>
                            <p className="text-muted">{user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <strong>Email:</strong>
                        <p className="text-muted">{user.email}</p>
                    </div>
                    <div className="mb-3">
                        <strong>Phone Number:</strong>
                        <p className="text-muted">{user.phoneNumber}</p>
                    </div>
                    <div className="mb-3">
                        <strong>Email:</strong>
                        <p className="text-muted">{user.email}</p>
                    </div>
                    <div className="mb-3">
                        <strong>Function:</strong>
                        <p className="text-muted">{user.jobTitle}</p>
                    </div>
                    <div className="mb-3">
                        <strong>Role:</strong>
                        <span className="badge bg-primary">{user.role}</span>
                    </div>

                    {/* <button className="btn btn-primary mt-4">
                        Change Profile
                    </button> */}
                </div>
            ) : (
                // EDIT MODE
                <form>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label">
                                Voornaam
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label">
                                Achternaam
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                            Telefoonnummer
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="jobTitle" className="form-label">
                            Functie
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="jobTitle"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="d-flex gap-2 mt-4">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            {isSaving ? (
                                <>
                                    <span className="spinner-border me-2" role="status" aria-hidden="true"></span>
                                    Opslaan...
                                </>
                            ) : (
                                'Opslaan'
                            )}
                        </button>
                        <button className="btn btn-secondary" type="button" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                    </div>

                </form>
            )}


        </div>
    );
};

export default ProfileCard;