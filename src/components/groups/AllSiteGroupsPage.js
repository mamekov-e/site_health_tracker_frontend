import React, {Component} from "react";

import {connect} from "react-redux";
import {deleteSiteGroup} from "../../services/index";

import "./../../assets/css/style.css";
import {Button, ButtonGroup, Card, FormControl, InputGroup, Table,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faExternalLinkAlt,
    faFastBackward,
    faFastForward,
    faList,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import ToastMessage from "../custom/ToastMessage";
import axios from "axios";

class AllSiteGroupsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siteGroups: [],
            search: "",
            currentPage: 1,
            siteGroupsPerPage: 5,
            sortDir: "asc",
        };
    }

    componentDidMount() {
        this.findAllSiteGroups(this.state.currentPage);
    }

    findAllSiteGroups(currentPage) {
        currentPage -= 1;
        axios
            .get(
                "http://localhost:8080/api/v1/site-groups?pageNumber=" +
                currentPage +
                "&pageSize=" +
                this.state.siteGroupsPerPage +
                "&sortBy=name&sortDir=" +
                this.state.sortDir
            )
            .then((response) => response.data)
            .then((data) => {
                this.setState({
                    siteGroups: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteSiteGroup = (siteGroupId) => {
        this.props.deleteSiteGroup(siteGroupId);
        setTimeout(() => {
            if (this.props.siteGroupObject != null) {
                this.setState({show: true});
                setTimeout(() => this.setState({show: false}), 3000);
                this.findAllSiteGroups(this.state.currentPage);
            } else {
                this.setState({show: false});
            }
        }, 1000);
    };

    changePage = (event) => {
        let targetPage = parseInt(event.target.value);

        if (isNaN(targetPage)) {
            return;
        }
        const totalPages = Math.ceil(this.state.totalElements / this.state.sitesPerPage);
        if (targetPage < 1 || targetPage > totalPages) {
            return;
        }
        console.log(targetPage)
        // if (this.state.search) {
        //     this.searchData(targetPage);
        // } else {
        //     this.findAllSiteGroups(targetPage);
        // }
        // this.setState({
        //     [event.target.name]: targetPage,
        // });
    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllSiteGroups(firstPage);
            }
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllSiteGroups(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(
            this.state.totalElements / this.state.siteGroupsPerPage
        );
        if (this.state.currentPage < condition) {
            if (this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllSiteGroups(condition);
            }
        }
    };

    nextPage = () => {
        if (
            this.state.currentPage <
            Math.ceil(this.state.totalElements / this.state.siteGroupsPerPage)
        ) {
            if (this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllSiteGroups(this.state.currentPage + 1);
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    cancelSearch = () => {
        this.setState({search: ""});
        this.findAllSiteGroups(this.state.currentPage);
    };

    searchData = (currentPage) => {
        if (this.state.search !== "") {
            currentPage -= 1;
            axios.get(
                "http://localhost:8080/api/v1/site-groups/search/" +
                this.state.search +
                "?page=" +
                currentPage +
                "&size=" +
                this.state.siteGroupsPerPage
            )
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                        siteGroups: data.content,
                        totalPages: data.totalPages,
                        totalElements: data.totalElements,
                        currentPage: data.number + 1,
                    });
                });
        }
    };

    render() {
        const {siteGroups, currentPage, totalPages, search} = this.state;

        return (
            <div>
                <div style={{display: this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        message={"Группа успешно удалена."}
                        type={"danger"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"lists-header"}>
                            <FontAwesomeIcon icon={faList}/>
                            <h6 style={{margin: 0}}>Список групп</h6>
                            <Link
                                to={"site-groups/add/"}
                                className="btn btn-sm btn-outline-light"
                            >
                                Добавить группу
                            </Link>{" "}
                        </div>
                        <div style={{float: "right"}}>
                            <InputGroup size="sm">
                                <FormControl
                                    style={{width: "250px"}}
                                    placeholder="Поиск"
                                    name="search"
                                    value={search}
                                    className={"info-border bg-dark text-white m-1"}
                                    onChange={this.searchChange}
                                />
                                <InputGroup.Append>
                                    <Button
                                        size="sm"
                                        variant="outline-info"
                                        type="button"
                                        className={"m-1"}
                                        onClick={this.searchData}
                                    >
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        type="button"
                                        onClick={this.cancelSearch}
                                    >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {siteGroups.length === 0 ? (
                                <tr align="center">
                                    <td colSpan="4">Список пуст</td>
                                </tr>
                            ) : (
                                siteGroups.map((siteGroup) => (
                                    <tr key={siteGroup.id}>
                                        <td> {siteGroup.name}</td>
                                        <td>{siteGroup.description}</td>
                                        <td>{siteGroup.status}</td>
                                        <td>
                                            <ButtonGroup className={"d-flex gap-2"}>
                                                <Link
                                                    to={"site-groups/edit/" + siteGroup.id}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </Link>{" "}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => this.deleteSiteGroup(siteGroup.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt}/>
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                    {siteGroups.length > 0 ? (
                        <Card.Footer>
                            <div style={{float: "left"}}>
                                Страница {currentPage} из {totalPages}
                            </div>
                            <div style={{float: "right"}}>
                                <InputGroup size="sm" className={"d-flex gap-2"}>
                                    <InputGroup.Prepend className={"d-flex gap-2"}>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1 ? true : false}
                                            onClick={this.firstPage}
                                        >
                                            <FontAwesomeIcon icon={faFastBackward}/> Первая
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1 ? true : false}
                                            onClick={this.prevPage}
                                        >
                                            <FontAwesomeIcon icon={faStepBackward}/> Предыдущая
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        className={"page-num bg-dark text-info rounded"}
                                        name="currentPage"
                                        value={currentPage}
                                        onChange={this.changePage}
                                    />
                                    <InputGroup.Append className={"d-flex gap-2"}>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === totalPages ? true : false}
                                            onClick={this.nextPage}
                                        >
                                            Следующая <FontAwesomeIcon icon={faStepForward}/>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === totalPages ? true : false}
                                            onClick={this.lastPage}
                                        >
                                            Последняя <FontAwesomeIcon icon={faFastForward}/>
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                        </Card.Footer>
                    ) : null}
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
        deleteSiteGroup: (siteGroupId) => dispatch(deleteSiteGroup(siteGroupId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSiteGroupsPage);

