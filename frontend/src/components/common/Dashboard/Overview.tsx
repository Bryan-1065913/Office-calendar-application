// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";

import { currentUser } from "../../../authentication/auth";

type Day = { wd: string; d: number; chips?: string[] };

const days: Day[] = [
    {wd: "Ma", d: 1, chips: ["Kantoor"]},
    {wd: "Di", d: 2, chips: ["Vrij"]},
    {wd: "Wo", d: 3, chips: ["Thuiswerken"]},
    {wd: "Do", d: 4, chips: ["Kantoor"]},
    {wd: "Vr", d: 5, chips: ["Thuiswerken"]},
];

const Overview = () => {
    return (
        <div>
            <div>
                <h1>Welkom, <span className="NameGreeting">{currentUser.name}</span>!</h1>
                <p>Vandaag: [hoeveelheid] meetings, [hoeveelheid] events, [hoeveelheid] taken</p>
            </div>

            <div className="container m-0 p-0">
                <div className="row g-3">
                    <div className="col-md-7">
                        <div className="d-flex flex-column gap-3">
                            <div className="card p-3 shadow-sm">
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <button className="btn btn-link p-0" aria-label="Terug">
                                        <img src="/src/assets/images/angle-left.svg" width="24" height="24" alt=""/>
                                    </button>
                                    <h5 className="mb-0 fw-bold">[maand] [jaar]</h5>
                                    <span className="text-muted">week</span>
                                </div>

                                <div className="row row-cols-2 row-cols-md-5 text-center g-3 align-items-start mb-3">
                                    {days.map(({wd, d, chips}) => (
                                        <div className="col" key={`${wd}${d}`}>
                                            <div className="fw-medium">{wd}</div>
                                            <div className="fs-4 lh-1">{d}</div>
                                            <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
                                                {(chips ?? []).map((c) => (
                                                    <span
                                                        key={c}
                                                        className={`badge rounded-pill px-3 py-2 text-white ${c === "Kantoor" ?
                                                            "bg-teal" : c === "Thuiswerken" ? "bg-lilac" : c === "Vrij" ? "bg-platinum" : "bg-secondary"}`}
                                                    >{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button className="btn btn-calendar fw-bold flex-fill">Nieuwe afspraak toevoegen</button>
                                    <button className="btn btn-calendar fw-bold flex-fill">Activiteit toevoegen</button>
                                </div>
                            </div>

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
                                                  style={{width: '12px', height: '12px', border: '2px solid white'}}></span>
                                        </div>
                                        <div>
                                            <div className="fw-medium">Anna</div>
                                            <small className="text-muted">Kantoor</small>
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
                                                  style={{width: '10px', height: '10px', border: '2px solid white'}}></span>
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
                                                  style={{width: '10px', height: '10px', border: '2px solid white'}}></span>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted"
                                             style={{width: '32px', height: '32px', fontSize: '12px'}}>
                                            +2
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-top">
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <small className="text-muted d-block">Kantoor</small>
                                            <strong className="text-success">3</strong>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block">Thuis</small>
                                            <strong className="text-warning">2</strong>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block">Afwezig</small>
                                            <strong className="text-danger">1</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="card p-3 shadow-sm">
                                    <h5 className="fw-bold mb-3">Vandaag</h5>
                                    <ul className="custom-bullets mb-0">
                                        <li>Kick-off meeting</li>
                                        <li>Project update</li>
                                        <li>Bedrijfstraining</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card p-3 shadow-sm">
                                    <h6 className="fw-bold">Mijn taken</h6>
                                    <div>
                                        <input type="checkbox" id="scales" name="scales" className="me-2"/>
                                        <label htmlFor="scales">Verslag afmaken</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card p-3 shadow-sm">
                                    <h6 className="fw-bold mb-2">Snelle notitie</h6>
                                    <textarea
                                        className="form-control border-0 bg-light"
                                        rows={3}
                                        placeholder="Typ hier een snelle notitie..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;