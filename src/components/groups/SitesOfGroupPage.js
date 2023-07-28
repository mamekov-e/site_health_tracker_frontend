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
import {BASE_URL} from "../../utils/config";

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
        if (siteGroupId) {
            this.setState({siteGroupId: siteGroupId})
            this.findAllGroupSitesById(this.state.currentPage, siteGroupId)
            this.findSiteGroupById(siteGroupId)
        }
    }

    async findAllGroupSitesById(currentPage, siteGroupId) {
        currentPage -= 1;
        try {
            const sitesPerPage = this.state.sitesPerPage;
            const sortDir = this.state.sortDir;
            const resp = await axios.get(`${BASE_URL}/site-groups/${siteGroupId}/sites?pageNumber=${currentPage}&pageSize=${sitesPerPage}&sortBy=name&sortDir=${sortDir}`);
            const data = resp.data;

            const totalPages = data.totalPages;
            this.setState({
                sites: data.content,
                totalPages: totalPages,
                totalElements: data.totalElements,
                currentPage: data.number + 1,
            });
            this.getAllPageNumbers(totalPages);
        } catch (e) {
            console.log(e);
        }
    }

    findSiteGroupById = async (siteGroupId) => {
        await this.props.fetchSiteGroup(siteGroupId);
        let siteGroup = this.props.siteGroupObject.siteGroup;

        if (siteGroup) {
            this.setState({
                siteGroup: {
                    name: siteGroup.name,
                    status: siteGroup.status
                }
            });
        }
    };

    deleteSitesOfGroupById = async (site) => {
        this.setState({deleteClicked: true})
        let sites = []
        sites.push(site)
        const siteGroupId = this.state.siteGroupId;
        await this.props.deleteSitesOfGroup(siteGroupId, sites);
        const resp = this.props.siteGroupObject;
        console.log(resp)
        if (resp.siteGroup.status === 204) {
            this.setState({show: true});
            setTimeout(() => {
                this.setState({show: false, deleteClicked: false});
            }, 2000);
            const currentPage = this.state.currentPage;
            if (this.isLastElementOnPage() && currentPage !== 1) {
                await this.findAllGroupSitesById(currentPage - 1, siteGroupId);
            } else {
                await this.findAllGroupSitesById(currentPage, siteGroupId);
            }
        } else if (resp.error) {
            this.setState({error: resp.error.data.message})
            setTimeout(() => {
                this.setState({error: null, deleteClicked: false})
            }, 3000);
        } else {
            this.setState({show: false, deleteClicked: false});
        }
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

    changePage = async (event) => {
        let targetPage = event.target.value;
        this.setState({
            [event.target.name]: targetPage,
        });
        const totalPages = Math.ceil(this.state.totalElements / this.state.sitesPerPage);
        targetPage = parseInt(targetPage);
        if (targetPage > 0 && targetPage <= totalPages) {
            if (this.state.search) {
                await this.searchData(targetPage);
            } else {
                await this.findAllGroupSitesById(targetPage, this.state.siteGroupId);
            }
        }
    };

    firstPage = async () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                await this.searchData(firstPage);
            } else {
                await this.findAllGroupSitesById(firstPage, this.state.siteGroupId);
            }
        }
    };

    prevPage = async () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                await this.searchData(this.state.currentPage - prevPage);
            } else {
                await this.findAllGroupSitesById(this.state.currentPage - prevPage, this.state.siteGroupId);
            }
        }
    };

    lastPage = async () => {
        let condition = Math.ceil(
            this.state.totalElements / this.state.sitesPerPage
        );
        if (this.state.currentPage < condition) {
            if (this.state.search) {
                await this.searchData(condition);
            } else {
                await this.findAllGroupSitesById(condition, this.state.siteGroupId);
            }
        }
    };

    nextPage = async () => {
        if (
            this.state.currentPage <
            Math.ceil(this.state.totalElements / this.state.sitesPerPage)
        ) {
            if (this.state.search) {
                await this.searchData(this.state.currentPage + 1);
            } else {
                await this.findAllGroupSitesById(this.state.currentPage + 1, this.state.siteGroupId);
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    refreshData = async () => {
        this.setState({
            search: "",
            siteGroupStatus: getGroupStatusMsg(this.props.siteGroupObject.siteGroup),
            siteGroupStatusBtnColor: getGroupStatusBtnColor(this.props.siteGroupObject.siteGroup),
            siteCheckModalShow: false
        });
        await this.findAllGroupSitesById(this.state.currentPage, this.state.siteGroupId);
    };

    searchData = async (currentPage) => {
        let currentPageForSearch = !isNaN(currentPage) ? currentPage : this.state.currentPage;
        console.log("currentPage", !isNaN(currentPage))
        console.log("currentPage", currentPage)
        console.log("currentPageForSearch", this.state.currentPage)
        const searchValue = this.state.search.trim();
        if (searchValue) {
            try {
                currentPageForSearch -= 1;
                const sitesPerPage = this.state.sitesPerPage
                const siteGroupId = this.state.siteGroupId
                const resp = await axios.get(`${BASE_URL}/site-groups/${siteGroupId}/sites/search/${searchValue}?page=${currentPageForSearch}&size=${sitesPerPage}`);
                const data = resp.data;

                this.setState({
                    sites: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1,
                });
                this.getAllPageNumbers(data.totalPages)
            } catch (e) {
                console.log(e)
            }

        } else {
            this.setState({search: ""})
        }
    }

    handleSearchSiteModalClose = async () => {
        this.setState({addSiteToGroupShow: false})
        await this.refreshData()
    }
    handleSiteCheckModalClose = () => {
        this.setState({siteCheckModalShow: false})
    }

    render() {
        const {
            sites, siteGroup, currentPage, totalPages, search, show,
            addSiteToGroupShow, error, siteCheckModalShow, clickedSite, deleteClicked
        } = this.state;

        return (
            <div>
                <div style={{display: show ? "block" : "none"}}>
                    <ToastMessage
                        show={show}
                        message={"Сайт успешно удален из группы."}
                        type={"danger"}
                    />
                </div>
                {addSiteToGroupShow && (
                    <SearchAndAddSiteModal handleModalClose={this.handleSearchSiteModalClose}
                                           addSiteToGroupShow={addSiteToGroupShow}
                                           siteGroupId={this.state.siteGroupId}/>
                )}
                {siteCheckModalShow && (
                    <SiteCheckLogsModal handleModalClose={this.handleSiteCheckModalClose}
                                        siteCheckModalShow={siteCheckModalShow}
                                        site={clickedSite}/>
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
                                    disabled={deleteClicked}
                                    className={"info-border bg-dark text-white m-1"}
                                    onChange={this.searchChange}
                                />
                                <InputGroup.Append>
                                    <Button
                                        size="sm"
                                        variant="outline-info"
                                        className={"m-1"}
                                        type="button"
                                        disabled={deleteClicked}
                                        onClick={this.searchData}
                                    >
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        className={"m-1"}
                                        type="button"
                                        disabled={deleteClicked}
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
                                disabled={deleteClicked}
                                onClick={() => {
                                    this.setState({addSiteToGroupShow: true})
                                }}
                            >
                                Добавить сайт в группу
                            </Button>
                            <div style={{float: "right"}}>
                                <Button
                                    size="sm"
                                    variant="outline-info"
                                    className={"m-1"}
                                    type="button"
                                    disabled={deleteClicked}
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
                                                    disabled={deleteClicked}
                                                    onClick={async () => {
                                                        await this.deleteSitesOfGroupById(site)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    disabled={deleteClicked}
                                                    onClick={() => {
                                                        this.setState({siteCheckModalShow: true, clickedSite: site})
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
                                            disabled={currentPage === 1 || deleteClicked}
                                            onClick={this.firstPage}
                                        >
                                            <FontAwesomeIcon icon={faFastBackward}/> Первая
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1 || deleteClicked}
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
                                        disabled={deleteClicked}
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
                                            disabled={currentPage === totalPages || deleteClicked}
                                            onClick={this.nextPage}
                                        >
                                            Следующая <FontAwesomeIcon icon={faStepForward}/>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === totalPages || deleteClicked}
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

