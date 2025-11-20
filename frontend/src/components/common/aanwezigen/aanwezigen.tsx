import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";
import '../aanwezigen/Aanwezigen.scss'

interface User {
  id: number;
  imgPath?: string;
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

const Aanwezigen = ({ eventUsers }: { eventUsers: User[] }) => {
  const { user } = useAuth();

  if (!user) return <NotFound />;

  return (
    <>
      {user.role === "user" &&
        eventUsers.map(({ id, imgPath, firstName, lastName }) => (
          <div key={id} className="gebruiker-item">
            <div className="img-exists">
              <img
                src={imgPath}
                className="profile-img"
              />
              <div className="profile-fullName">{firstName} {lastName}</div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Aanwezigen;
