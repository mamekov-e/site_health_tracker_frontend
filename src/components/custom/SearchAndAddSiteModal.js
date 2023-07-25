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
import ToastMessage from "./ToastMessage";

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

    addSitesToGroup = (siteToAdd) => {
        let sites = []
        sites.push(siteToAdd)
        console.log("Adding to group: ", sites)

        this.props.addSitesToGroup(this.state.siteGroupId, sites);
        setTimeout(() => {
            const resp = this.props.siteObject;
            console.log("resp ", resp)
            if (resp.site) {
                this.setState({show: true});
                setTimeout(() => {
                    this.setState({show: false, search: ""})
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
            }
        }
    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                this.searchData(firstPage);
            }
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
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
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    cancelSearch = () => {
        this.setState({search: "", sites: []});
    };

    searchData = (currentPage) => {
        const searchValue = this.state.search.trim();
        if (searchValue) {
            currentPage -= 1;
            axios.get(
                "http://localhost:8080/api/v1/sites/search/" +
                searchValue +
                "?page=" +
                currentPage +
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

    render() {
        const {sites, currentPage, totalPages, search, error, show} = this.state;
        return (
            <>
                <div style={{display: show ? "block" : "none"}}>
                    <ToastMessage
                        show={show}
                        message={"Сайт успешно добавлен в группу."}
                        type={"success"}
                    />
                </div>
                <Modal show={this.props.addSiteToGroupShow}
                       dialogClassName={"my-modal"}
                       onHide={this.props.handleModalClose}>
                    <Modal.Header className={"modal-content"}>
                        <Modal.Title className={"text-light"}>Поиск сайтов для добавления</Modal.Title>
                        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                            <InputGroup size="lg" style={{width: "70%"}}>
                                <FormControl
                                    style={{width: "70%"}}
                                    placeholder="Поиск"
                                    name="search"
                                    value={search}
                                    className={"info-border bg-dark text-white m-1"}
                                    onChange={this.searchChange}
                                />
                                <InputGroup.Append>
                                    <Button
                                        size="lg"
                                        variant="outline-info"
                                        className={"m-1"}
                                        type="button"
                                        onClick={this.searchData}
                                    >
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button
                                        size="lg"
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
                        {error && (
                            <div className={"error-message"}>
                                {error}
                            </div>
                        )}
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
                                                    onClick={() => this.addSitesToGroup(site)}
                                                >
                                                    Добавить в группу
                                                </Button>
                                                {/*<Button*/}
                                                {/*    size="sm"*/}
                                                {/*    variant="outline-warning"*/}
                                                {/*    onClick={() => {*/}
                                                {/*    }}*/}
                                                {/*>*/}
                                                {/*    <FontAwesomeIcon icon={faExternalLinkAlt}/>*/}
                                                {/*</Button>*/}
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
                        ) : null}
                        <Button variant={"secondary"} style={{float: "right"}}
                                onClick={this.props.handleModalClose}>Закрыть</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        siteObject: state.site,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSitesToGroup: (siteGroupId, sites) => dispatch(addSitesToGroup(siteGroupId, sites)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchAndAddSiteModal);
