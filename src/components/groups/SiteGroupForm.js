import React, {Component} from "react";

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
            show: false,
        };
    }

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
    }

    findSiteGroupById = (siteGroupId) => {
        this.props.fetchSiteGroup(siteGroupId);
        let siteGroup = this.props.siteGroupObject.siteGroup;
        // setTimeout(() => {
            if (siteGroup != null) {
                this.setState({
                    id: siteGroup.id,
                    name: siteGroup.name,
                    description: siteGroup.description
                });
            }
        // }, 1000);
    };

    resetSiteGroup = () => {
        this.setState(() => this.state.id ? {
            ...this.initialState,
            id: this.state.id,
        } : this.initialState);
    };

    submitSiteGroup = (event) => {
        event.preventDefault();

        const siteGroup = {
            name: this.state.name,
            description: this.state.description
        };

        this.props.saveSiteGroup(siteGroup);
        setTimeout(() => {
            if (this.props.siteGroupObject.siteGroup != null) {
                this.setState({show: true, method: "post"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteGroupList();
                }, 1500);
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    updateSiteGroup = (event) => {
        event.preventDefault();

        const siteGroup = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description
        };
        this.props.updateSiteGroup(siteGroup);
        setTimeout(() => {
            if (this.props.siteGroupObject.siteGroup != null) {
                this.setState({show: true, method: "put"});
                setTimeout(() => {
                    this.setState({show: false})
                    this.siteGroupList()
                }, 1500);
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    siteGroupChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    siteGroupList = () => {
        return this.props.history.push("/site-groups");
    };

    render() {
        const {name, description} = this.state;

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
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>{" "}
                        {this.state.id ? "Редактировать группу" : "Добавить новую группу"}
                    </Card.Header>
                    <Form
                        onReset={this.resetSiteGroup}
                        onSubmit={this.state.id ? this.updateSiteGroup : this.submitSiteGroup}
                        id="siteGroupFormId"
                    >
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Название</Form.Label>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={this.siteGroupChange}
                                        className={"bg-dark text-white"}
                                        placeholder="Введите название группы"
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridDescription">
                                    <Form.Label>Описание</Form.Label>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={this.siteGroupChange}
                                        className={"bg-dark text-white"}
                                        placeholder="Напишите описание группы"
                                    />
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