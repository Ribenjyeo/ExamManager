import './navbar.css'

function NavBar(props){
    let items = [];
    for (let item of props.items){
        if (window.location.pathname === item.href)
        {
            items.push(<a href={`${item.href}`} class="nav-item" style={{fontWeight: "bold"}}>{item.title}</a>);
        }
        else
        {
            items.push(<a href={`${item.href}`} class="nav-item">{item.title}</a>);
        }
    }
    
    return (
    <div class="nav">
        <div class="nav-title">
            <a href="/account"><i class="fa fa-solid fa-user"></i>{props.userName}</a>
        </div>
        {items}
        <a href="/logout" class="nav-exit">Выйти</a>
    </div>
    );
}

export default NavBar;