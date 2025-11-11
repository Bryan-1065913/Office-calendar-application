// src/components/common/Dashboard/TeamCard.tsx
const TeamCard = () => {
    return (
        <div className="card p-3 shadow-sm">
            <h5 className="mb-0 fw-bold mb-3">Team</h5>

            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div className="position-relative">
                        <img
                            src="/src/assets/images/default-user.svg"
                            width="40"
                            height="40"
                            className="rounded-circle bg-light p-1"
                            alt="Anna"
                        />
                        {/* Online status dot */}
                        <span className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                              style={{
                                  width: '12px',
                                  height: '12px',
                                  border: '2px solid white'
                              }}></span>
                    </div>
                    <div>
                        <div className="fw-medium">Anna</div>
                        <small className="text-muted">Office</small>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <div className="position-relative">
                        <img
                            src="/src/assets/images/default-user.svg"
                            width="32"
                            height="32"
                            className="rounded-circle bg-info p-1"
                            alt="Teamlid"
                        />
                        <span className="position-absolute bottom-0 end-0 bg-warning rounded-circle"
                              style={{
                                  width: '10px',
                                  height: '10px',
                                  border: '2px solid white'
                              }}></span>
                    </div>

                    <div className="position-relative">
                        <img
                            src="/src/assets/images/default-user.svg"
                            width="32"
                            height="32"
                            className="rounded-circle bg-primary p-1"
                            alt="Teamlid"
                        />
                        <span className="position-absolute bottom-0 end-0 bg-danger rounded-circle"
                              style={{
                                  width: '10px',
                                  height: '10px',
                                  border: '2px solid white'
                              }}></span>
                    </div>

                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted"
                        style={{width: '32px', height: '32px', fontSize: '12px'}}>
                        +2
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-top">
                <div className="row text-center">
                    <div className="col-4">
                        <small className="text-muted d-block">Office</small>
                        <strong className="text-success">3</strong>
                    </div>
                    <div className="col-4">
                        <small className="text-muted d-block">Home</small>
                        <strong className="text-warning">2</strong>
                    </div>
                    <div className="col-4">
                        <small className="text-muted d-block">Absent</small>
                        <strong className="text-danger">1</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;