import React, {Component} from "react";
import {connect} from "react-redux";
import "./../../assets/css/style.css";
import {Button, Card, FormControl, InputGroup, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faFastBackward,
    faFastForward,
    faList,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import axiosInstance from "../../services/axiosInstance";
import {BASE_URL} from "../../utils/config";

class AllUsersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            search: "",
            currentPage: 1,
            usersPerPage: 5,
            pageNumbers: [{value: 1, display: 1}],
            sortDir: "asc",
            showToast: false,
            deleteClicked: false,
            error: null,
        };
    }

    componentDidMount() {
        this.findAllUsers(this.state.currentPage);
    }

    async findAllUsers(currentPage) {
        currentPage -= 1;
        try {
            const response = await axiosInstance.get(`${BASE_URL}/admin/users?pageNumber=${currentPage}&pageSize=${this.state.usersPerPage}&sortBy=id&sortDir=${this.state.sortDir}`);

            const data = response.data;
            this.setState({
                users: data.content,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                currentPage: data.number + 1,
            });
            this.getAllPageNumbers(data.totalPages);
        } catch (error) {
            console.error(error);
        }
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
                await this.findAllSites(targetPage);
            }
        }
    };

    firstPage = async () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.search) {
                await this.searchData(firstPage);
            } else {
                await this.findAllSites(firstPage);
            }
        }
    };

    prevPage = async () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                await this.searchData(this.state.currentPage - prevPage);
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
                await this.searchData(condition);
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
                await this.searchData(this.state.currentPage + 1);
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
                const usersPerPage = this.state.usersPerPage
                const resp = await axiosInstance.get(`${BASE_URL}/admin/users/search/${searchValue}?pageNumber=${currentPage}&pageSize=${usersPerPage}&sortBy=id&sortDir=${this.state.sortDir}`);

                const data = resp.data;

                this.setState({
                    users: data.content,
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
        const {users, currentPage, totalPages, search, showToast, deleteClicked, error} = this.state;
        return (
            <div>
                {showToast && <ToastMessage show={showToast} message="Пользователь успешно удален." type="danger"/>}
                {error && <div className="error-message">{error}</div>}
                <Card className="border border-dark bg-dark text-white">
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={faList}/>
                            <h6 style={{margin: 0}}>Список пользователей</h6>
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
                                        onClick={() => this.searchData(this.state.currentPage)}
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
                        <Table bordered hover striped responsive variant="dark">
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Номер</th>
                                <th>Роль</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length === 0 ? (
                                <tr align="center">
                                    <td colSpan="4">Список пуст</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.firstName + ' ' + user.lastName + ' ' + user.middleName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.roles && user.roles[0] == 'ROLE_ADMIN' ? 'админ' : 'пользователь'}</td>
                                        {/*<td>*/}
                                        {/*    <ButtonGroup>*/}
                                        {/*        <Link to={`/users/edit/${user.id}`}*/}
                                        {/*              className="btn btn-sm btn-outline-primary"*/}
                                        {/*              disabled={deleteClicked}><FontAwesomeIcon icon={faEdit}/></Link>*/}
                                        {/*        <Button size="sm" variant="outline-danger"*/}
                                        {/*                onClick={() => this.deleteUser(user.id)}*/}
                                        {/*                disabled={deleteClicked}><FontAwesomeIcon*/}
                                        {/*            icon={faTrash}/></Button>*/}
                                        {/*    </ButtonGroup>*/}
                                        {/*</td>*/}
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                    {users.length > 0 && (
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
                    )}
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userObject: state.user,
});


export default connect(mapStateToProps)(AllUsersPage);
