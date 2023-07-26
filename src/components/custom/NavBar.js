import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import appLogo from "../../assets/images/app-logo.svg"

class NavBar extends React.Component {


    render() {
        return (
            <Navbar bg="dark" data-bs-theme="dark"  className={"mb-3"}>
                <Container>
                    <Link to={"#"} className={"navbar-brand d-flex flex-row align-items-center gap-3"}>
                        <img style={{width: 50, height: 40, borderRadius: 5, background: '#393646'}}
                             src={appLogo} alt={''}/>
                        <h5 className={"m-0"}>
                            Site Health Tracker
                        </h5>
                    </Link>
                    <Nav className={"me-auto ms-5 gap-2"}>
                        <Link to={"/sites"} className={"navbar-link text-decoration-none"}
                              style={{color: '#F4EEE0'}}>
                            | Все сайты |
                        </Link>
                        <Link to={"/site-groups"} className={"navbar-link text-decoration-none"}
                              style={{color: '#F4EEE0'}}>
                            | Все группы |
                        </Link>
                        <Link to={"/mailings"} className={"navbar-link text-decoration-none"}
                              style={{color: '#F4EEE0'}}>
                            | Уведомления |
                        </Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

export default NavBar;
