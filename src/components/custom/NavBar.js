import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import appLogo from "../../assets/images/app-logo.svg"
import {faSignInAlt, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {logoutUser} from "../../services/auth/authActions";
import {connect} from "react-redux";

class NavBar extends React.Component {
    handleLogout = () => {
        this.props.logoutUser();
    };

    render() {
        const { isAuthenticated, currentUser } = this.props;
        const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");

        return (
            <Navbar bg="dark" data-bs-theme="dark" className={"mb-3"}>
                <Container>
                    <Link to={"/"} className={"navbar-brand d-flex flex-row align-items-center gap-3"}>
                        <img style={{width: 50, height: 40, borderRadius: 5, background: '#393646'}}
                             src={appLogo} alt={''}/>
                        <h5 className={"m-0"}>
                            Site Health Tracker
                        </h5>
                    </Link>
                    {isAuthenticated ? (
                        <Nav className={"me-auto ms-5 gap-2"}>
                            <Link to={"/sites"} className={"navbar-link text-decoration-none"}
                                  style={{color: '#F4EEE0'}}>
                                | Все сайты |
                            </Link>
                            <Link to={"/site-groups"} className={"navbar-link text-decoration-none"}
                                  style={{color: '#F4EEE0'}}>
                                | Все группы |
                            </Link>
                            {isAdmin && (
                                <Link to={"/admin/users"} className={"navbar-link text-decoration-none"} style={{ color: '#F4EEE0' }}>
                                    | Пользователи |
                                </Link>
                            )}
                            <Link to={"/mailings"} className={"navbar-link text-decoration-none"}
                                  style={{color: '#F4EEE0'}}>
                                | Уведомления |
                            </Link>
                        </Nav>
                    ) : ''}
                    <Nav className={"m-0 ms-5 gap-2"}>
                        {isAuthenticated ? (
                            <Link to="/login" className="navbar-link text-decoration-none"
                                  style={{color: '#F4EEE0'}} onClick={this.handleLogout}>
                                Выйти <FontAwesomeIcon icon={faSignOutAlt}
                                                       style={{cursor: "pointer"}}/>
                            </Link>
                        ) : (
                            <Link to="/login" className="navbar-link text-decoration-none" style={{color: '#F4EEE0'}}>
                                Войти <FontAwesomeIcon icon={faSignInAlt}
                                                       style={{cursor: "pointer"}}/>
                            </Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        currentUser: state.auth.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => dispatch(logoutUser()), // Map logoutUser action to props
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
