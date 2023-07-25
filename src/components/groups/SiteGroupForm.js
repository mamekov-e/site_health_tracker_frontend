import React, {Component} from "react";

import * as yup from "yup";
import ru from "yup-locale-ru";
import * as formik from "formik";

import {connect} from "react-redux";
import {fetchSiteGroup, saveSiteGroup, updateSiteGroup,} from "../../services/index";

import {Button, Card, Col, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faList, faPlusSquare, faSave, faUndo,} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";

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

    findSiteGroupById = (siteGroupId) => {
        this.props.fetchSiteGroup(siteGroupId);
        setTimeout(() => {
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
        }, 300);
    };

    resetSiteGroup = () => {
        this.setState(() => this.state.id ? {
            ...this.initialState,
            id: this.state.id,
        } : this.initialState);
    };

    submitSiteGroup = (values) => {
        const siteGroup = {
            name: values.name,
            description: values.description
        };

        this.props.saveSiteGroup(siteGroup);
        setTimeout(() => {
            const resp = this.props.siteGroupObject;
            if (resp.siteGroup != null) {
                this.setState({show: true, method: "post"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteGroupList();
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

    updateSiteGroup = (values) => {
        const siteGroup = {
            id: this.state.id,
            name: values.name,
            description: values.description
        };
        this.props.updateSiteGroup(siteGroup);
        setTimeout(() => {
            if (this.props.siteGroupObject.siteGroup != null) {
                this.setState({show: true, method: "put"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteGroupList()
                }, 2000);
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    siteGroupList = () => {
        return this.props.history.push("/site-groups");
    };

    schema = () => yup.object().shape({
        name: yup.string().trim()
            .required("Обязательное поле")
            .min(4, "Должно быть минимум 4 символа")
            .max(256, "Превышен лимит количества символов 256"),
    });

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
                                ? "Группа успешно изменена."
                                : "Группа успешно сохранена."
                        }
                        type={"success"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>{" "}
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
                        validationSchema={this.schema()}
                        onReset={this.resetSiteGroup}
                        onSubmit={this.state.id ? this.updateSiteGroup : this.submitSiteGroup}
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
                                        onClick={() => this.siteGroupList()}
                                    >
                                        <FontAwesomeIcon icon={faList}/> Все группы
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
        // fetchLanguages: () => dispatch(fetchLanguages()),
        // fetchGenres: () => dispatch(fetchGenres()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteGroupForm);