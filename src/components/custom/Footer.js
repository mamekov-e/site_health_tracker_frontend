import React, {useEffect, useState} from "react";

import {Col, Container, Navbar} from "react-bootstrap";

const Footer = () => {
    const [fullYear, setFullYear] = useState(null);

    useEffect(() => {
        setFullYear(new Date().getFullYear());
    }, [fullYear]);

    return (
        <Navbar fixed="bottom" bg="dark" variant="dark" className={"mt-3"}>
            <Container>
                <Col lg={12} className="text-light text-center">
                    <div>
                        Астана, {fullYear}
                    </div>
                </Col>
            </Container>
        </Navbar>
    );
};

export default Footer;