import React, {Component} from "react";

import * as formik from 'formik';
import * as yup from 'yup';
import ru from 'yup-locale-ru';

import {connect} from "react-redux";
import {fetchSite, saveSite, updateSite,} from "../../services/index";

import {Button, Card, Col, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faSave, faUndo,} from "@fortawesome/free-solid-svg-icons";
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

    findSiteById = async (siteId) => {
        await this.props.fetchSite(siteId);
        let site = this.props.siteObject.site;
        if (site) {
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
    };

    resetSite = () => {
        this.setState(() => this.state.id ? {
            ...this.initialState,
            id: this.state.id,
        } : this.initialState);
    };

    submitSite = async (values) => {
        this.setState({submitClicked: true})
        const siteId = this.state.id;
        const site = {
            id: siteId,
            name: values.name.trim(),
            description: values.description.trim(),
            url: values.url.trim(),
            siteHealthCheckInterval: values.siteHealthCheckInterval.trim()
        };

        if (siteId) {
            await this.props.updateSite(site);
        } else {
            await this.props.saveSite(site);
        }
        const resp = this.props.siteObject;
        if (resp.site) {
            this.setState({show: true, method: siteId ? "put" : "post"});
            setTimeout(() => {
                this.setState({show: false, submitClicked: false})
                this.siteList()
            }, 2000);
        } else if (resp.error) {
            this.setState({error: resp.error.data.message})
            setTimeout(() => {
                this.setState({error: null, submitClicked: false})
            }, 3000);
        } else {
            this.setState({show: false, submitClicked: false});
        }
    };

    siteList = () => {
        return this.props.history.push("/sites");
    };

    render() {
        const {error,submitClicked, show} = this.state;
        const {Formik} = formik;
        return (
            <div>
                <div style={{display: show ? "block" : "none"}}>
                    <ToastMessage
                        show={show}
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
                            <FontAwesomeIcon icon={faArrowLeft}
                                             onClick={this.props.history.goBack}
                                             style={{cursor: "pointer"}}/>
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
                        onSubmit={this.submitSite}
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
                                                readOnly={show}
                                                type="text"
                                                name="name"
                                                value={values.name.trimStart()}
                                                isInvalid={!!errors.name}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите название"
                                                disabled={submitClicked}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridUrl">
                                            <Form.Label>URL</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                readOnly={show}
                                                type="text"
                                                name="url"
                                                value={values.url.trimStart()}
                                                isInvalid={!!errors.url}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите URL"
                                                disabled={submitClicked}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.url}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridSiteHealthCheckInterval">
                                            <Form.Label>Периодичность проверки сайта (в секундах)</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                readOnly={show}
                                                type="text"
                                                name="siteHealthCheckInterval"
                                                value={values.siteHealthCheckInterval.trimStart()}
                                                isInvalid={!!errors.siteHealthCheckInterval}
                                                onChange={handleChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Введите периодичность"
                                                disabled={submitClicked}
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
                                                readOnly={show}
                                                type="text"
                                                name="description"
                                                value={values.description.trimStart()}
                                                isInvalid={!!errors.description}
                                                onChange={handleChange}
                                                style={{height: "220px", resize: "none"}}
                                                className={"bg-dark text-white"}
                                                placeholder="Напишите описание"
                                                disabled={submitClicked}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                </Card.Body>
                                <Card.Footer style={{textAlign: "right"}}>
                                    <Button size="sm" variant="success" type="submit" disabled={submitClicked}>
                                        <FontAwesomeIcon icon={faSave}/>{" "}
                                        {this.state.id ? "Редактировать" : "Сохранить"}
                                    </Button>{" "}
                                    <Button size="sm" variant="info" type="reset" disabled={submitClicked}>
                                        <FontAwesomeIcon icon={faUndo}/> Сбросить
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