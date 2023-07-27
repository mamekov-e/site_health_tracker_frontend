import React, {Component} from "react";

import {connect} from "react-redux";
import {deleteSitesOfGroup, fetchSiteGroup} from "../../services/index";

import "./../../assets/css/style.css";
import {Button, ButtonGroup, Card, FormControl, InputGroup, Table,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faExternalLinkAlt,
    faFastBackward,
    faFastForward,
    faRedo,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import axios from "axios";
import {getGroupStatusBtnColor, getGroupStatusMsg} from "../../utils/statusConverter";
import SearchAndAddSiteModal from "./SearchAndAddSiteModal";
import SiteCheckLogsModal from "../sites/SiteCheckLogsModal";

class SitesOfGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addSiteToGroupShow: false,
            sites: [],
            siteGroup: {
                status: "",
                name: ""
            },
            error: "",
            search: "",
            currentPage: 1,
            sitesPerPage: 5,
            pageNumbers: [{value: 1, display: 1}],
            sortDir: "asc",
            siteCheckModalShow: false
        };
    }

    componentDidMount() {
        const siteGroupId = +this.props.match.params.id;
        console.log(siteGroupId)
        if (siteGroupId) {
            this.setState({siteGroupId: siteGroupId})
            this.findAllGroupSitesById(this.state.currentPage, siteGroupId)
            this.findSiteGroupById(siteGroupId)
        }
    }

    findAllGroupSitesById(currentPage, siteGroupId) {
        currentPage -= 1;
        axios
            .get(
                "http://localhost:8080/api/v1/site-groups/" + siteGroupId +
                "/sites?pageNumber=" +
                currentPage +
                "&pageSize=" +
                this.state.sitesPerPage +
                "&sortBy=name&sortDir=" +
                this.state.sortDir
            )
            .then((response) => response.data)
            .then((data) => {
                console.log(data)
                const totalPages = data.totalPages;
                this.setState({
                    sites: data.content,
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

    findSiteGroupById = (siteGroupId) => {
        this.props.fetchSiteGroup(siteGroupId);
        setTimeout(() => {
            let siteGroup = this.props.siteGroupObject.siteGroup;
            console.log("this.props", this.props.siteGroupObject)
            if (siteGroup != null) {
                this.setState({
                    siteGroup: {
                        name: siteGroup.name,
                        status: siteGroup.status
                    }
                });
            }
        }, 300);
    };

    deleteSitesOfGroupById = (site) => {
        let sites = []
        sites.push(site)
        const siteGroupId = this.state.siteGroupId;
        this.props.deleteSitesOfGroup(siteGroupId, sites);
        setTimeout(() => {
            const resp = this.props.siteGroupObject;
            console.log("resp", resp)
            if (!resp.error) {
                this.setState({show: true});
                setTimeout(() => {
                    this.setState({show: false});
                }, 2000);
                const currentPage = this.state.currentPage;
                if (this.isLastElementOnPage() && currentPage !== 1) {
                    this.findAllGroupSitesById(currentPage - 1, siteGroupId);
                } else {
                    this.findAllGroupSitesById(currentPage, siteGroupId);
                }
            } else {
                this.setState({error: resp.error.data.message})
                setTimeout(() => {
                    this.setState({error: null})
                }, 3000);
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
        const totalPages = Math.ceil(this.state.totalElements / this.state.sitesPerPage);
        targetPage = parseInt(targetPage);
        if (targetPage > 0 && targetPage <= totalPages) {
            if (this.state.search) {
                this.searchData(targetPage);
            } else {
                this.findAllGroupSitesById(targetPage, this.state.siteGroupId);
            }
        }
    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllGroupSitesById(firstPage, this.state.siteGroupId);
            }
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllGroupSitesById(this.state.currentPage - prevPage, this.state.siteGroupId);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(
            this.state.totalElements / this.state.sitesPerPage
        );
        if (this.state.currentPage < condition) {
            if (this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllGroupSitesById(condition, this.state.siteGroupId);
            }
        }
    };

    nextPage = () => {
        if (
            this.state.currentPage <
            Math.ceil(this.state.totalElements / this.state.sitesPerPage)
        ) {
            if (this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllGroupSitesById(this.state.currentPage + 1, this.state.siteGroupId);
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    refreshData = () => {
        this.setState({
            search: "",
            siteGroupStatus: getGroupStatusMsg(this.props.siteGroupObject.siteGroup),
            siteGroupStatusBtnColor: getGroupStatusBtnColor(this.props.siteGroupObject.siteGroup),
            siteCheckModalShow: false
        });
        this.findAllGroupSitesById(this.state.currentPage, this.state.siteGroupId);
    };

    searchData = (currentPage) => {
        let currentPageForSearch = !isNaN(currentPage) ? currentPage : this.state.currentPage;
        console.log("currentPage", !isNaN(currentPage))
        console.log("currentPage", currentPage)
        console.log("currentPageForSearch", this.state.currentPage)
        const searchValue = this.state.search.trim();
        if (searchValue) {
            currentPageForSearch -= 1;
            axios.get(
                "http://localhost:8080/api/v1/site-groups/" + this.state.siteGroupId + "/sites/search/" +
                searchValue +
                "?page=" +
                currentPageForSearch +
                "&size=" +
                this.state.sitesPerPage
            )
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                        sites: data.content,
                        totalPages: data.totalPages,
                        totalElements: data.totalElements,
                        currentPage: data.number + 1,
                    });
                    this.getAllPageNumbers(data.totalPages)
                });
        } else {
            this.setState({search: ""})
        }
    }

    handleModalClose = () => {
        this.setState({addSiteToGroupShow: false})
        this.refreshData()
    }

    render() {
        const {
            sites, siteGroup, currentPage, totalPages, search,
            addSiteToGroupShow, error, siteCheckModalShow
        } = this.state;

        return (
            <div>
                <div style={{display: this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        message={"Сайт успешно удален из группы."}
                        type={"danger"}
                    />
                </div>
                {addSiteToGroupShow && (
                    <SearchAndAddSiteModal handleModalClose={this.handleModalClose}
                                           addSiteToGroupShow={addSiteToGroupShow}
                                           siteGroupId={this.state.siteGroupId}/>
                )}
                {error && (
                    <div className={"error-message"}>
                        {error}
                    </div>
                )}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={faArrowLeft} onClick={this.props.history.goBack}
                                             style={{cursor: "pointer"}}/>
                            <h6 style={{margin: 0}}>Список сайтов группы - <span
                                className={"text-light"}>{siteGroup.name}</span></h6>
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
                                        className={"m-1"}
                                        type="button"
                                        onClick={this.searchData}
                                    >
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        className={"m-1"}
                                        type="button"
                                        onClick={this.refreshData}
                                    >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className={"mb-3"}>
                            <Button
                                size="sm"
                                variant="outline-light"
                                onClick={() => {
                                    this.setState({addSiteToGroupShow: true})
                                }}
                            >
                                Добавить сайт в группу
                            </Button>
                            <div style={{float: "right"}}>
                                {/*<Button*/}
                                {/*    size={"sm"}*/}
                                {/*    type="button"*/}
                                {/*    variant={siteGroupStatusBtnColor}*/}
                                {/*    style={{cursor: "default", pointerEvents: "none"}}*/}
                                {/*>*/}
                                {/*    {siteGroupStatus}*/}
                                {/*</Button>*/}
                                <Button
                                    size="sm"
                                    variant="outline-info"
                                    className={"m-1"}
                                    type="button"
                                    onClick={this.refreshData}
                                >
                                    Обновить <FontAwesomeIcon icon={faRedo}/>
                                </Button>
                            </div>
                        </div>
                        <Table bordered hover striped responsive={"md"} variant="dark">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>URL</th>
                                <th>Статус</th>
                                <th>Периодичность</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sites.length === 0 ? (
                                <tr align="center">
                                    <td colSpan="6">Список пуст</td>
                                </tr>
                            ) : (
                                sites.map((site) => (
                                    <tr key={site.id}>
                                        <td> {site.name}</td>
                                        <td>{site.description}</td>
                                        <td>{site.url}</td>
                                        <td>
                                            <Button
                                                type="button"
                                                variant={site.status === "DOWN" ? "danger" : "success"}
                                                style={{cursor: "default", pointerEvents: "none"}}
                                            >
                                                {site.status === "DOWN" ? "недоступен" : "доступен"}
                                            </Button>
                                        </td>
                                        <td>{site.siteHealthCheckInterval + " сек."}</td>
                                        <td>
                                            <ButtonGroup className={"d-flex gap-2"}>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => this.deleteSitesOfGroupById(site)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                        this.setState({siteCheckModalShow: true})
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt}/>
                                                </Button>
                                                {siteCheckModalShow && (
                                                    <SiteCheckLogsModal handleModalClose={this.refreshData}
                                                                        siteCheckModalShow={siteCheckModalShow}
                                                                        siteId={site.id}/>
                                                )}
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                    {sites.length > 0 ? (
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
        siteGroupObject: state.siteGroup
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteSitesOfGroup: (siteId, sites) => dispatch(deleteSitesOfGroup(siteId, sites)),
        fetchSiteGroup: (siteGroupId) => dispatch(fetchSiteGroup(siteGroupId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SitesOfGroup);

