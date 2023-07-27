import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {ButtonGroup, FormControl, InputGroup, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faFastBackward,
    faFastForward,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import {addSitesToGroup} from "../../services";
import {connect} from "react-redux";
import axios from "axios";
import ToastMessage from "../custom/ToastMessage";
import {BASE_URL} from "../../utils/config";

class SearchAndAddSiteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [],
            search: "",
            siteGroupId: props.siteGroupId,
            currentPage: 1,
            sitesPerPage: 5,
            pageNumbers: [{value: 1, display: 1}],
            sortDir: "asc",
            show: false
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

    addSitesToGroup = async (site) => {
        this.setState({submitClicked: true})

        let sites = []
        sites.push(site)

        await this.props.addSitesToGroup(this.state.siteGroupId, sites);
        const resp = this.props.siteGroupObject;
        if (!resp.error) {
            this.setState({show: true});
            setTimeout(() => {
                this.setState({show: false, submitClicked: false})
            }, 2000);
        } else {
            this.setState({error: resp.error.data.message, show: true})
            setTimeout(() => {
                this.setState({show: false, submitClicked: false})
            }, 3000);
        }
    };

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

    refreshSearch = () => {
        this.setState({search: "", sites: []});
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
                // console.log(e)
            }
        } else {
            this.setState({search: ""})
        }
    }

    render() {
        const {sites, currentPage, totalPages, search, error, show, submitClicked} = this.state;
        return (
            <>
                <div style={{display: show ? "block" : "none"}}>
                    <ToastMessage
                        show={show}
                        error={error ? "Ошибка" : null}
                        message={error ? error : "Сайт успешно добавлен в группу."}
                        type={error ? "danger" : "success"}
                    />
                </div>
                <Modal show={this.props.addSiteToGroupShow}
                       dialogClassName={"my-modal"}
                       onHide={this.props.handleModalClose}>
                    <Modal.Header className={"modal-content"}>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                            <Modal.Title className={"text-light"} style={{width: "60%"}}>Поиск сайтов для добавления</Modal.Title>
                            <Button variant={"secondary"}
                                    style={{float: "right"}}
                                    disabled={submitClicked}
                                    onClick={this.props.handleModalClose}>Закрыть</Button>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                            <InputGroup size="lg" style={{width: "70%"}}>
                                <FormControl
                                    style={{width: "70%"}}
                                    placeholder="Поиск"
                                    name="search"
                                    value={search}
                                    className={"info-border bg-dark text-white m-1"}
                                    onChange={this.searchChange}
                                    disabled={submitClicked}
                                />
                                <InputGroup.Append>
                                    <Button
                                        size="lg"
                                        variant="outline-info"
                                        className={"m-1"}
                                        type="button"
                                        disabled={submitClicked}
                                        onClick={async () => {
                                            await this.searchData()
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline-danger"
                                        className={"m-1"}
                                        type="button"
                                        disabled={submitClicked}
                                        onClick={this.refreshSearch}
                                    >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
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
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    disabled={submitClicked}
                                                    onClick={async () => {
                                                        await this.addSitesToGroup(site)
                                                    }}
                                                >
                                                    Добавить в группу
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        {sites.length > 0 ? (
                            <div style={{float: "left"}}>
                                <InputGroup size="sm" className={"d-flex gap-2"}>
                                    <InputGroup.Prepend className={"d-flex gap-2"}>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1 || submitClicked}
                                            onClick={this.firstPage}
                                        >
                                            <FontAwesomeIcon icon={faFastBackward}/> Первая
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === 1 || submitClicked}
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
                                        disabled={submitClicked}
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
                                            disabled={currentPage === totalPages || submitClicked}
                                            onClick={this.nextPage}
                                        >
                                            Следующая <FontAwesomeIcon icon={faStepForward}/>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline-info"
                                            disabled={currentPage === totalPages || submitClicked}
                                            onClick={this.lastPage}
                                        >
                                            Последняя <FontAwesomeIcon icon={faFastForward}/>
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                        ) : null}
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        siteGroupObject: state.siteGroup,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSitesToGroup: (siteGroupId, sites) => dispatch(addSitesToGroup(siteGroupId, sites)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchAndAddSiteModal);
