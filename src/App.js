import React from "react";

import './App.css';
import NavBar from "./components/custom/NavBar";
import Footer from "./components/custom/Footer";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import AllSiteGroupsPage from "./components/groups/AllSiteGroupsPage";
import SiteForm from "./components/sites/SiteForm";
import SiteGroupForm from "./components/groups/SiteGroupForm";
import AllSitesPage from "./components/sites/AllSitesPage";
import SitesOfGroup from "./components/groups/SitesOfGroupPage";
import SearchAndAddSiteModal from "./components/groups/SearchAndAddSiteModal";
import MailingPage from "./components/mailings/MailingPage";

function App() {
    return (
        <Router>
            <NavBar/>
            <Container>
                <Row>
                    <Col lg={12} className={"margin-top"}>
                        <Switch>
                            <Route path="/" exact component={AllSitesPage}/>
                            <Route path="/sites" exact component={AllSitesPage}/>
                            <Route path="/sites/add" exact component={SiteForm}/>
                            <Route path="/sites/edit/:id" exact component={SiteForm}/>
                            <Route path="/site-groups" exact component={AllSiteGroupsPage}/>
                            <Route path="/site-groups/:id/sites" exact component={SitesOfGroup}/>
                            <Route path="/site-groups/:id/sites/add" exact component={SearchAndAddSiteModal}/>
                            <Route path="/site-groups/add" exact component={SiteGroupForm}/>
                            <Route path="/site-groups/edit/:id" exact component={SiteGroupForm}/>
                            <Route path="/mailings" exact component={MailingPage}/>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </Router>
    );
}

export default App;
