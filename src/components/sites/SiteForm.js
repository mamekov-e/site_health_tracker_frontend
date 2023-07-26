import React, {Component} from "react";

import * as formik from 'formik';
import * as yup from 'yup';
import ru from 'yup-locale-ru';

import {connect} from "react-redux";
import {fetchSite, saveSite, updateSite,} from "../../services/index";

import {Button, Card, Col, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faList, faPlusSquare, faSave, faUndo,} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import {siteFormSchema} from "../../utils/yupSchemas";

class SiteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            description: "",
            url: "",
            siteHealthCheckInterval: "",
            show: false,
        };
    }

    formikRef = React.createRef();

    initialState = {
        id: "",
        name: "",
        description: "",
        url: "",
        siteHealthCheckInterval: ""
    };

    componentDidMount() {
        const siteId = +this.props.match.params.id;
        if (siteId) {
            this.findSiteById(siteId);
        }
        yup.setLocale(ru);
    }

    findSiteById = (siteId) => {
        this.props.fetchSite(siteId);
        setTimeout(() => {
            let site = this.props.siteObject.site;
            if (site != null) {
                this.setState({
                    id: site.id,
                    name: site.name,
                    description: site.description,
                    url: site.url,
                    siteHealthCheckInterval: site.siteHealthCheckInterval
                });
                this.formikRef.current.setValues({
                        id: site.id,
                        name: site.name,
                        description: site.description,
                        url: site.url,
                        siteHealthCheckInterval: site.siteHealthCheckInterval + ""
                    }
                )
            }
        }, 300);
    };

    resetSite = () => {
        this.setState(() => this.state.id ? {
            ...this.initialState,
            id: this.state.id,
        } : this.initialState);
    };

    submitSite = (values) => {
        const site = {
            name: values.name,
            description: values.description,
            url: values.url,
            siteHealthCheckInterval: values.siteHealthCheckInterval
        };

        this.props.saveSite(site);
        setTimeout(() => {
            const resp = this.props.siteObject;
            if (resp.site) {
                this.setState({show: true, method: "post"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteList()
                }, 2000);
            } else if (resp.error) {
                this.setState({error: resp.error.data.message})
                setTimeout(() => {
                    this.setState({error: null})
                }, 3000);
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    updateSite = (values) => {
        const site = {
            id: this.state.id,
            name: values.name,
            description: values.description,
            url: values.url,
            siteHealthCheckInterval: values.siteHealthCheckInterval
        };
        this.props.updateSite(site);
        setTimeout(() => {
            const resp = this.props.siteObject;
            if (resp.site) {
                this.setState({show: true, method: "put"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteList();
                }, 2000);
            } else if (resp.error) {
                this.setState({error: resp.error.data.message})
                setTimeout(() => {
                    this.setState({error: null})
                }, 3000);
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    siteList = () => {
        return this.props.history.push("/sites");
    };

    render() {
        const {error} = this.state;
        const {Formik} = formik;
        return (
            <div>
                <div style={{display: this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        message={
                            this.state.method === "put"
                                ? "Сайт успешно изменен."
                                : "Сайт успешно сохранен."
                        }
                        type={"success"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>{"  "}
                            {this.state.id ? "Редактировать сайт" : "Добавить новый сайт"}
                        </div>
                        {error && (
                            <div className={"error-message"}>
                                {error}
                            </div>
                        )}
                    </Card.Header>
                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                            url: "",
                            siteHealthCheckInterval: ""
                        }}
                        innerRef={this.formikRef}
                        validationSchema={siteFormSchema}
                        onReset={this.resetSite}
                        onSubmit={this.state.id ? this.updateSite : this.submitSite}
                    >
                        {({handleSubmit, handleReset, handleChange, values, errors}) => (
                            <Form
                                onReset={handleReset}
                                onSubmit={handleSubmit}
                                noValidate
                                id="siteFormId"
                            >
                                <Card.Body className={"d-flex justify-content-around"}>
                                    <Form.Row className={"w-50 form-row1"}>
                                        <Form.Group as={Col} controlId="formGridName">
                                            <Form.Label>Название</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                readOnly={this.state.show}
                                                type="text"
                                                name="name"
                                                value={values.name.trimStart()}
                                                isInvalid={!!errors.name}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите название"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridUrl">
                                            <Form.Label>URL</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                readOnly={this.state.show}
                                                type="text"
                                                name="url"
                                                value={values.url.trimStart()}
                                                isInvalid={!!errors.url}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите URL"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.url}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridSiteHealthCheckInterval">
                                            <Form.Label>Периодичность проверки сайта (в секундах)</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                readOnly={this.state.show}
                                                type="text"
                                                name="siteHealthCheckInterval"
                                                value={values.siteHealthCheckInterval.trimStart()}
                                                isInvalid={!!errors.siteHealthCheckInterval}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите периодичность"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.siteHealthCheckInterval}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className={"w-50 offset-1"}>
                                        <Form.Group as={Col} controlId="formGridDescription">
                                            <Form.Label>Описание</Form.Label>
                                            <Form.Control
                                                as={"textarea"}
                                                autoComplete="off"
                                                readOnly={this.state.show}
                                                type="text"
                                                name="description"
                                                value={values.description.trimStart()}
                                                isInvalid={!!errors.description}
                                                onChange={handleChange}
                                                style={{height: "220px", resize: "none"}}
                                                className={"bg-dark text-white"}
                                                placeholder="Напишите описание"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                </Card.Body>
                                <Card.Footer style={{textAlign: "right"}}>
                                    <Button size="sm" variant="success" type="submit">
                                        <FontAwesomeIcon icon={faSave}/>{" "}
                                        {this.state.id ? "Редактировать" : "Сохранить"}
                                    </Button>{" "}
                                    <Button size="sm" variant="info" type="reset">
                                        <FontAwesomeIcon icon={faUndo}/> Сбросить
                                    </Button>{" "}
                                    <Button
                                        size="sm"
                                        variant="info"
                                        type="button"
                                        onClick={() => this.siteList()}
                                    >
                                        <FontAwesomeIcon icon={faList}/> Все сайты
                                    </Button>
                                </Card.Footer>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        siteObject: state.site,
        error: state.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveSite: (site) => dispatch(saveSite(site)),
        fetchSite: (siteId) => dispatch(fetchSite(siteId)),
        updateSite: (site) => dispatch(updateSite(site))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteForm);