import { useAuth } from "../../../authentication/AuthContext";

const ProfileCard = () => {
    // check user auth
    const { user } = useAuth();

    if (!user) {
        return <div className="alert alert-info">Loading profiel...</div>;
    }


    return (
        <div className="card p-3 shadow-sm">
            <h6 className="fw-bold">My Profile</h6>
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

                <button className="btn btn-primary mt-4">
                    Change Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;