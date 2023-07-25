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
    faList, faRedo,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import ToastMessage from "../custom/ToastMessage";
import axios from "axios";
import {getGroupStatusBtnColor, getGroupStatusMsg} from "../../utils/statusConverter";

class AllSiteGroupsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siteGroups: [],
            search: "",
            currentPage: 1,
            siteGroupsPerPage: 5,
            pageNumbers: [{value: 1, display: 1}],
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
                const totalPages = data.totalPages;
                this.setState({
                    siteGroups: data.content,
                    totalPages: totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1,
                });
                this.getAllPageNumbers(totalPages);

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
                setTimeout(() => {
                    this.setState({show: false})
                }, 2000);
                if (this.isLastElementOnPage() && this.state.currentPage !== 1) {
                    this.findAllSiteGroups(this.state.currentPage - 1);
                } else {
                    this.findAllSiteGroups(this.state.currentPage);
                }
            } else {
                this.setState({show: false});
            }
        }, 500);
    };

    isLastElementOnPage() {
        const currentPage = this.state.currentPage;
        const sitesPerPage = this.state.sitesPerPage;
        const firstElementOnPage = (currentPage - 1) * sitesPerPage + 1;

        const lastElementOnPage = Math.min(currentPage * sitesPerPage, this.state.totalElements);

        return firstElementOnPage === lastElementOnPage;
    }

    getAllPageNumbers(totalPages) {
        let totalElementsArr = []
        for (let i = 1; i <= totalPages; i++) {
            totalElementsArr.push(i);
        }
        if (totalElementsArr) {
            this.setState({
                pageNumbers:
                    totalElementsArr.map((pageNumber) => {
                        return {value: pageNumber, display: pageNumber};
                    })
            });
        }
    };

    changePage = (event) => {
        let targetPage = event.target.value;
        this.setState({
            [event.target.name]: targetPage,
        });
        const totalPages = Math.ceil(this.state.totalElements / this.state.siteGroupsPerPage);
        targetPage = parseInt(targetPage);
        if (targetPage > 0 && targetPage <= totalPages) {
            if (this.state.search) {
                this.searchData(targetPage);
            } else {
                this.findAllSiteGroups(targetPage);
            }
        }
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
        console.log("this.state.currentPage", this.state.currentPage)
        this.findAllSiteGroups(this.state.currentPage);
    };

    searchData = (currentPage) => {
        const searchValue = this.state.search.trim();
        if (searchValue !== "") {
            currentPage -= 1;
            axios.get(
                "http://localhost:8080/api/v1/site-groups/search/" +
                searchValue +
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
                    this.getAllPageNumbers(data.totalPages)
                });
        } else {
            this.setState({search: ""})
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
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={faList}/>
                            <h6 style={{margin: 0}}>Список групп</h6>
                        </div>
                        <div style={{float: "right"}}>
                            <InputGroup size="sm">
                                <FormControl
                                    style={{width: "250px", textColor: "blue"}}
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
                                        className={"m-1"}
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
                        <div className={"mb-3"}>
                            <Link
                                to={"site-groups/add/"}
                                className="btn btn-sm btn-outline-light"
                            >
                                Добавить группу
                            </Link>
                            <Button
                                style={{float:"right"}}
                                size="sm"
                                variant="outline-info"
                                className={"m-1"}
                                type="button"
                                onClick={()=>{this.findAllSiteGroups(currentPage)}}
                            >
                                Обновить <FontAwesomeIcon icon={faRedo}/>
                            </Button>
                        </div>
                        <Table bordered hover striped responsive={"md"} variant="dark">
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
                                        <td>
                                            <Button
                                                type="button"
                                                size={"sm"}
                                                variant={getGroupStatusBtnColor(siteGroup)}
                                                style={{cursor: "default", pointerEvents: "none"}}
                                            >
                                                {getGroupStatusMsg(siteGroup)}
                                            </Button>
                                        </td>
                                        <td>
                                            <ButtonGroup className={"d-flex gap-2"}>
                                                <Link
                                                    to={"site-groups/edit/" + siteGroup.id}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => this.deleteSiteGroup(siteGroup.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </Button>
                                                <Link
                                                    to={"site-groups/" + siteGroup.id + "/sites"}
                                                    className="btn btn-sm btn-outline-warning"
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt}/>
                                                </Link>
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
                                        as="select"
                                        custom
                                        className={"page-num bg-dark text-info rounded"}
                                        style={{minWidth: "60px"}}
                                        name="currentPage"
                                        value={currentPage}
                                        onChange={this.changePage}
                                    >
                                        {this.state.pageNumbers.map((pageNumber) => (
                                            <option key={pageNumber.value} value={pageNumber.value}>
                                                {pageNumber.display}
                                            </option>
                                        ))}
                                    </FormControl>
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

