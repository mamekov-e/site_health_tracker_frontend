import React, {Component} from "react";

import * as formik from 'formik';
import * as yup from 'yup';
import ru from 'yup-locale-ru';

import {connect} from "react-redux";

import {Button, Card, Col, Form, Image} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faPaperPlane, faUndo,} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import botQr from "../../assets/images/telegram-bot-qr.png"
import {registerEmail, unregisterEmail} from "../../services";
import {emailSchema} from "../../utils/yupSchemas";
import {TELEGRAM_BOT_URL} from "../../utils/config";


class SiteForm extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            email: "",
            subscribe: true,
            show: false,
        };
    }

    openTelegramBot = () => {
        window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer');
    };

    formikRef = React.createRef();

    componentDidMount() {
        yup.setLocale(ru);
    }

    submitEmail = async (values) => {
        this.setState({submitClicked: true})
        const email = {
            "email-address": values.email.trim()
        };
        if (this.state.subscribe) {
            await this.props.registerEmail(email);
        } else {
            await this.props.unregisterEmail(email);
        }

        const resp = this.props.emailObject;
        if (resp.email) {
            this.setState({show: true});
            setTimeout(() => {
                this.setState({email: "", show: false, submitClicked: false})
            }, 1500);
        } else if (resp.error) {
            this.setState({error: resp.error.data.message})
            setTimeout(() => {
                this.setState({error: null, submitClicked: false})
            }, 1500);
        }
    };

    handleSubscribe = (value) => {
        console.log(value);
        this.setState((prevState) => ({
            ...prevState,
            subscribe: value,
        }))
    }

    render() {
        const {error, subscribe, show} = this.state;
        const {Formik} = formik;
        return (
            <div>
                <div style={{display: show ? "block" : "none"}}>
                    <ToastMessage
                        show={show}
                        message={subscribe ? "Письмо подтверждения успешно отправлено" : "Вы успешно отписались от рассылки"}
                        type={subscribe ? "success" : "danger"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon icon={faBell}/>{"  "}
                            {"Подписка на рассылку"}
                        </div>
                        {error && (
                            <div className={"error-message"}>
                                {error}
                            </div>
                        )}
                    </Card.Header>
                    <Formik
                        initialValues={{
                            email: JSON.parse(localStorage.getItem("user")).email,
                            subscribe: subscribe
                        }}
                        innerRef={this.formikRef}
                        validationSchema={emailSchema}
                        onSubmit={this.submitEmail}
                    >
                        {({handleSubmit, handleReset, handleChange, values, errors}) => (
                            <Form
                                onReset={handleReset}
                                onSubmit={handleSubmit}
                                noValidate
                                id="emailFormId"
                            >
                                <Card.Body className={"d-flex justify-content-around"}>
                                    <Form.Row className={"w-25 h-100 form-row1 d-flex flex-column"}>
                                        <div className={"d-flex justify-content-around"}>
                                            <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>Ваша почта</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    readOnly={true}
                                                    type="text"
                                                    name="email"
                                                    value={values.email.trimStart()}
                                                    isInvalid={!!errors.email}
                                                    onChange={handleChange}
                                                    className={"bg-dark text-white"}
                                                    placeholder="Введите почту"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div style={{display: "flex", justifyContent: "space-between", gap: "15px"}}>
                                            <Button size="sm"
                                                    variant="success"
                                                    type="submit"
                                                    onClick={() => this.handleSubscribe(true)}
                                                    style={{width: "50%"}}>Подписаться
                                            </Button>{"  "}
                                            <Button size="sm"
                                                    variant="info"
                                                    type="submit"
                                                    onClick={() => this.handleSubscribe(false)}
                                                    style={{width: "50%"}}>Отписаться
                                            </Button>
                                        </div>
                                        <div>
                                            <p style={{fontSize: "14px"}}>Подпишитесь на получение уведомлений о статусе
                                                изменений групп. На Ваш адрес почты будет отправлено письмо для подтверждения подписки.
                                                Если Вы не получили письмо проверьте папку "Спам". Убедитесь в
                                                корректности почты в случае если письма нигде нет.</p>
                                        </div>
                                    </Form.Row>
                                    <Form.Row className={"w-25 form-row1 d-flex flex-column"}>
                                        <Image src={botQr} width={"250px"} height={"250px"} style={{margin: 0}}/>
                                        <Button size="sm"
                                                variant="primary"
                                                type="reset"
                                                onClick={this.openTelegramBot}>
                                            <FontAwesomeIcon icon={faPaperPlane}/> Перейти на телеграм бота
                                        </Button>
                                    </Form.Row>
                                </Card.Body>
                                <Card.Footer style={{textAlign: "right", height: "40px", marginTop: "3%"}}>
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
        emailObject: state.email,
        error: state.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerEmail: (email) => dispatch(registerEmail(email)),
        unregisterEmail: (email) => dispatch(unregisterEmail(email))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteForm);