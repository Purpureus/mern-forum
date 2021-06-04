import { useParams } from 'react-router-dom';

const UserDetails = () => {

    const { requestedUsername } = useParams();

    const storage = window.localStorage;
    const userDatabase = JSON.parse(storage.getItem('user-database'));

    let userExists = false;
    let userData = {};

    console.log(userDatabase);
    
    for(let userIndex = 0; userIndex < userDatabase.length; userIndex++) {
	const currentUser = userDatabase[userIndex];
	if(currentUser.username.toLowerCase() === requestedUsername.toLowerCase()) {
	    userExists = true;
	    userData.username = currentUser.username;
	    userData.biography = currentUser.biography;
	    break;
	}
    }

    return (
        <div className="user-details">
	    { userExists
              ? <> <h3 id="username">{ userData.username }</h3>
		<p id="biography">{ userData.biography }</p> </>
	      : <h3>User could not be found.</h3>}
        </div>
    );
}

export default UserDetails;
