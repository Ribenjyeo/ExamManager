import { Route, BrowserRouter as Router } from 'react-router';


function Account() {
    let { path, url } = useRouteMatch();
    let userData = getUserData();

    return (
        <Router>
            <Route path={`${path}/`} />
        </Router>
        )
}

async function getUserData() {
    const response = await fetch('weatherforecast');
    return await response.json();    
}

export default Account;