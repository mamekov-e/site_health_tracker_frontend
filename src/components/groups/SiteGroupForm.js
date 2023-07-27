import React, {Component} from "react";

import * as yup from "yup";
import ru from "yup-locale-ru";
import * as formik from "formik";

import {connect} from "react-redux";
import {fetchSiteGroup, saveSiteGroup, updateSiteGroup,} from "../../services/index";

import {Button, Card, Col, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faSave, faUndo,} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import {siteGroupFormSchema} from "../../utils/yupSchemas";

class SiteGroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state = {
            id: "",
            name: "",
            description: "",
            show: false,
        };
    }

    formikRef = React.createRef();

    initialState = {
        id: "",
        name: "",
        description: ""
    };

    componentDidMount() {
        const siteGroupId = +this.props.match.params.id;
        if (siteGroupId) {
            this.findSiteGroupById(siteGroupId);
        }
        yup.setLocale(ru);
    }

    findSiteGroupById = async (siteGroupId) => {
        await this.props.fetchSiteGroup(siteGroupId);
        let siteGroup = this.props.siteGroupObject.siteGroup;
        if (siteGroup != null) {
            this.setState({
                id: siteGroup.id,
                name: siteGroup.name,
                description: siteGroup.description
            });
            this.formikRef.current.setValues({
                    id: siteGroup.id,
                    name: siteGroup.name,
                    description: siteGroup.description
                }
            )
        }
    };

    resetSiteGroup = () => {
        this.setState(() => this.state.id ? {
            ...this.initialState,
            id: this.state.id,
        } : this.initialState);
    };

    submitSiteGroup = async (values) => {
        this.setState({submitClicked: true})
        const siteGroupId = this.state.id;
        const siteGroup = {
            id: siteGroupId,
            name: values.name,
            description: values.description
        };
        if (siteGroupId) {
            await this.props.updateSiteGroup(siteGroup);
        } else {
            await this.props.saveSiteGroup(siteGroup);
        }
        const resp = this.props.siteGroupObject;
        if (resp.siteGroup != null) {
            this.setState({show: true, method: siteGroupId ? "put" : "post"});
            setTimeout(() => {
                this.setState({show: false, submitClicked: false})
                this.siteGroupList();
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

    siteGroupList = () => {
        return this.props.history.push("/site-groups");
    };

    render() {
        const {error, submitClicked} = this.state;
        const {Formik} = formik;

        return (
            <div>
                <div style={{display: this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        message={
                            this.state.method === "put"
                                ? "Группа успешно изменена."
                                : "Группа успешно сохранена."
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
                            {this.state.id ? "Редактировать группу" : "Добавить новую группу"}
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
                            description: ""
                        }}
                        innerRef={this.formikRef}
                        validationSchema={siteGroupFormSchema}
                        onReset={this.resetSiteGroup}
                        onSubmit={this.submitSiteGroup}
                    >
                        {({handleSubmit, handleReset, handleChange, values, errors}) => (
                            <Form
                                onReset={handleReset}
                                onSubmit={handleSubmit}
                                noValidate
                                id="siteGroupFormId"
                            >
                                <Card.Body>
                                    <Form.Row>
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
                                                placeholder="Введите название группы"
                                                disabled={submitClicked}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
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
        siteGroupObject: state.siteGroup,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveSiteGroup: (siteGroup) => dispatch(saveSiteGroup(siteGroup)),
        fetchSiteGroup: (siteGroupId) => dispatch(fetchSiteGroup(siteGroupId)),
        updateSiteGroup: (siteGroup) => dispatch(updateSiteGroup(siteGroup)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteGroupForm);