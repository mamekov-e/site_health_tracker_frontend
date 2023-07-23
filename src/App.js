import React from "react";

import './App.css';
import NavBar from "./components/custom/NavBar";
import Footer from "./components/custom/Footer";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import Welcome from "./components/Welcome";
import AllSiteGroupsPage from "./components/groups/AllSiteGroupsPage";
import SiteForm from "./components/sites/SiteForm";
import SiteGroupForm from "./components/groups/SiteGroupForm";
import AllSitesPage from "./components/sites/AllSitesPage";

function App() {
    return (
        <Router>
            <NavBar/>
            <Container>
                <Row>
                    <Col lg={12} className={"margin-top"}>
                        <Switch>
                            <Route path="/" exact component={Welcome}/>
                            <Route path="/sites" exact component={AllSitesPage}/>
                            <Route path="/sites/add" exact component={SiteForm}/>
                            <Route path="/sites/edit/:id" exact component={SiteForm}/>
                            <Route path="/site-groups" exact component={AllSiteGroupsPage}/>
                            <Route path="/site-groups/add" exact component={SiteGroupForm}/>
                            <Route path="/site-groups/edit/:id" exact component={SiteGroupForm}/>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </Router>
    );
}

export default App;
