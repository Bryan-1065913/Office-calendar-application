// src/components/common/Admin/StatsCards.tsx
interface StatsCardsProps {
    totalUsers: number;
    adminCount: number;
    userCount: number;
}

const StatsCards = ({ totalUsers, adminCount, userCount }: StatsCardsProps) => {
    return (
        <div className="row g-3 mb-4">
            <div className="col-md-4">
                <div className="card text-center">
                    <div className="card-body">
                        <p className="text-muted mb-1">Total Users</p>
                        <h2 className="mb-0 fw-bold">{totalUsers}</h2>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-center">
                    <div className="card-body">
                        <p className="text-muted mb-1">Admins</p>
                        <h2 className="mb-0 fw-bold">{adminCount}</h2>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-center">
                    <div className="card-body">
                        <p className="text-muted mb-1">Regular Users</p>
                        <h2 className="mb-0 fw-bold">{userCount}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;