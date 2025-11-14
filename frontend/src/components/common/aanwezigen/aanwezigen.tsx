import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";

interface User {
    id: number;
    companyId: number;
    departmentId: number;
    workplaceId: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    jobTitle: string;
    role: string;
    createdAt: string;
}

const aanwezigen = ({ eventUsers }: { eventUsers: User[] }) => { 
    const { user } = useAuth();
    if (user == null) {
        return <NotFound/>
    }
    return (
        <>
            {/* same thing here but this time a panel on the right will be shown */}    
            { user != null && user.role === "user"  && (
            <div className="gebruikers-main-users">
                <div className="gebruikers-panel-users">
                    <table>
                        <thead>
                            <th className="gebruikers-th-id">ID</th>
                            <th className="gebruikers-th-name">NAME</th>
                        </thead>
                        {/* loops true all users and give bakc the id and lastname for the panel*/}
                        {eventUsers.map(({ id, lastName}) => (

                            <tbody className="gebruikers-paneel-Card-users">
                                <tr>
                                    <td className="gebruikers-user-id">{id}</td>
                                    <td className="gebruikers-user-name">{lastName}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            )}
        </>
    )
};
export default aanwezigen;