import React, {useEffect} from "react";

import './App.css';
import NavBar from "./components/custom/NavBar";
import Footer from "./components/custom/Footer";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import AllSiteGroupsPage from "./components/groups/AllSiteGroupsPage";
import SiteForm from "./components/sites/SiteForm";
import SiteGroupForm from "./components/groups/SiteGroupForm";
import AllSitesPage from "./components/sites/AllSitesPage";
import SitesOfGroup from "./components/groups/SitesOfGroupPage";
import SearchAndAddSiteModal from "./components/groups/SearchAndAddSiteModal";
import MailingPage from "./components/mailings/MailingPage";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import RegistrationForm from "./components/auth/SignupForm";
import SigninForm from "./components/auth/SigninForm";
import PrivateRoute from "./components/custom/PrivateRoute";

import {connect} from 'react-redux';

const App = ({isAuthenticated}) => {

    return (
        <Router>
            <NavBar isAuthenticated={isAuthenticated}/>
            <Container>
                <Row>
                    <Col lg={12} className={"margin-top"}>
                        <Switch>
                            <Route path="/login" exact component={SigninForm}/>
                            <Route path="/register" exact component={RegistrationForm}/>
                            <Route path="/forgot-password" exact component={ForgotPasswordForm}/>

                            <Route path="/" exact render={() => (
                                isAuthenticated ? <Redirect to="/sites"/> : <Redirect to="/login"/>
                            )}/>

                            <PrivateRoute path="/sites" exact component={AllSitesPage}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/sites/add" exact component={SiteForm}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/sites/edit/:id" exact component={SiteForm}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/site-groups" exact component={AllSiteGroupsPage}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/site-groups/:id/sites" exact component={SitesOfGroup}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/site-groups/:id/sites/add" exact component={SearchAndAddSiteModal}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/site-groups/add" exact component={SiteGroupForm}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/site-groups/edit/:id" exact component={SiteGroupForm}
                                          isAuthenticated={isAuthenticated}/>
                            <PrivateRoute path="/mailings" exact component={MailingPage}
                                          isAuthenticated={isAuthenticated}/>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </Router>
    );
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

export default connect(mapStateToProps)(App);