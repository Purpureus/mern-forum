import { useParams } from 'react-router-dom';

const UserDetails = () => {

    const { requestedUsername } = useParams();

    const storage = window.localStorage;
    const userDatabase = JSON.parse(storage.getItem('user-database'));

    if (!userDatabase) {
        return (
            <p className="error">The requested user does not exist.</p>
        );
    }

    let userExists = false;
    let userData = {};

    for (let userIndex = 0; userIndex < userDatabase.length; userIndex++) {
        const currentUser = userDatabase[userIndex];
        if (currentUser.username.toLowerCase() === requestedUsername.toLowerCase()) {
            userExists = true;
            userData.username = currentUser.username;
            userData.biography = currentUser.biography;
            break;
        }
    }

    return (
        <div className="user-details">
            { userExists
                ? <> <h3 id="username">{userData.username}</h3>
                    <p id="biography">{userData.biography}</p> </>
                : <h3>User could not be found.</h3>}
        </div>
    );
}

export default UserDetails;
