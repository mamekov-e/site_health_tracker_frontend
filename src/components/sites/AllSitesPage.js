import React, {Component} from "react";

import {connect} from "react-redux";
import {deleteSite} from "../../services/index";

import "./../../assets/css/style.css";
import {Button, ButtonGroup, Card, FormControl, InputGroup, Table,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faExternalLinkAlt,
    faFastBackward,
    faFastForward,
    faList,
    faRedo,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import ToastMessage from "../custom/ToastMessage";
import axios from "axios";
import SiteCheckLogsModal from "./SiteCheckLogsModal";
import {BASE_URL} from "../../utils/config";

class AllSitesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [],
            search: "",
            currentPage: 1,
            sitesPerPage: 5,
            pageNumbers: [{value: 1, display: 1}],
            sortDir: "asc",
            siteCheckModalShow: false
        };
    }

    componentDidMount() {
        this.findAllSites(this.state.currentPage);
    }

    async findAllSites(currentPage) {
        currentPage -= 1;
        try {
            const sitesPerPage = this.state.sitesPerPage;
            const sortDir = this.state.sortDir;
            const resp = await axios.get(`${BASE_URL}/sites?pageNumber=${currentPage}&pageSize=${sitesPerPage}&sortBy=name&sortDir=${sortDir}`);
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

    deleteSite = async (siteId) => {
        this.setState({deleteClicked: true})
        await this.props.deleteSite(siteId);
        if (this.props.siteObject != null) {
            this.setState({show: true});
            setTimeout(() => {
                this.setState({show: false, deleteClicked: false});
            }, 2000);
            if (this.isLastElementOnPage() && this.state.currentPage !== 1) {
                await this.findAllSites(this.state.currentPage - 1);
            } else {
                await this.findAllSites(this.state.currentPage);
            }
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
                this.searchData(targetPage);
            } else {
                await this.findAllSites(targetPage);
            }
        }
    };

    firstPage = async () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                this.searchData(firstPage);
            } else {
                await this.findAllSites(firstPage);
            }
        }
    };

    prevPage = async () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                await this.findAllSites(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = async () => {
        let condition = Math.ceil(
            this.state.totalElements / this.state.sitesPerPage
        );
        if (this.state.currentPage < condition) {
            if (this.state.search) {
                this.searchData(condition);
            } else {
                await this.findAllSites(condition);
            }
        }
    };

    nextPage = async () => {
        if (
            this.state.currentPage <
            Math.ceil(this.state.totalElements / this.state.sitesPerPage)
        ) {
            if (this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                await this.findAllSites(this.state.currentPage + 1);
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    refreshPage = async () => {
        this.setState({search: "", siteCheckModalShow: false});
        await this.findAllSites(this.state.currentPage);
    };

    searchData = async (currentPage) => {
        const searchValue = this.state.search.trim();
        if (searchValue) {
            currentPage -= 1;
            try {
                const sitesPerPage = this.state.sitesPerPage
                const resp = await axios.get(`${BASE_URL}/sites/search/${searchValue}?page=${currentPage}&size=${sitesPerPage}`);

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

    render() {
        const {sites, currentPage, totalPages, search, siteCheckModalShow, clickedSite, deleteClicked} = this.state;

        return (
            <div>
                <div style={{display: this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        message={"Сайт успешно удален."}
                        type={"danger"}
                    />
                </div>
                {siteCheckModalShow && (
                    <SiteCheckLogsModal handleModalClose={this.refreshPage}
                                        siteCheckModalShow={siteCheckModalShow}
                                        site={clickedSite}/>
                )}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={faList}/>
                            <h6 style={{margin: 0}}>Список сайтов</h6>
                        </div>
                        <div style={{float: "right"}}>
                            <InputGroup size="sm">
                                <FormControl
                                    style={{width: "250px"}}
                                    placeholder="Поиск"
                                    name="search"
                                    value={search}
                                    className={"info-border bg-dark text-white m-1"}
                                    disabled={deleteClicked}
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
                                        onClick={this.refreshPage}
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
                                to={"sites/add/"}
                                className={`btn btn-sm btn-outline-light ${deleteClicked ? "disabled" : ""} `}
                            >
                                Добавить сайт
                            </Link>
                            <Button
                                style={{float: "right"}}
                                size="sm"
                                variant="outline-info"
                                className={"m-1"}
                                type="button"
                                disabled={deleteClicked}
                                onClick={async () => {
                                    await this.findAllSites(currentPage)
                                }}
                            >
                                Обновить <FontAwesomeIcon icon={faRedo}/>
                            </Button>
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
                                                size={"sm"}
                                                variant={site.status === "DOWN" ? "danger" : "success"}
                                                style={{cursor: "default", pointerEvents: "none"}}
                                            >
                                                {site.status === "DOWN" ? "недоступен" : "доступен"}
                                            </Button>
                                        </td>
                                        <td>{site.siteHealthCheckInterval + " сек."}</td>
                                        <td>
                                            <ButtonGroup className={"d-flex gap-2"}>
                                                <Link
                                                    to={"sites/edit/" + site.id}
                                                    className={`btn btn-sm btn-outline-primary ${deleteClicked ? "disabled" : ""} `}
                                                >
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </Link>{" "}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    disabled={deleteClicked}
                                                    onClick={() => this.deleteSite(site.id)}
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
                                            disabled={currentPage === 1  || deleteClicked}
                                            onClick={this.firstPage}
                                        >
                                            <FontAwesomeIcon icon={faFastBackward}/> Первая
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1  || deleteClicked}
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
                                        disabled={deleteClicked}
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
        siteObject: state.site,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteSite: (siteId) => dispatch(deleteSite(siteId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSitesPage);

