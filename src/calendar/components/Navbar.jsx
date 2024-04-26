export const Navbar = () => {
    return(
        <div className="navbar navbar-dark bg-dark mb-4 px-4">
            <span className="navbar-brand">
                <i className="fa-solid fa-calendar-days" />
                &nbsp;
                JonathanHD - Agendas
            </span>

            <button className="btn btn-outline-danger">
                <i className="fa-solid fa-right-from-bracket"></i>
                &nbsp;
                <span>Salir</span>
            </button>
        </div>
    )
}