import React, {useState} from "react";
import {Form, Button, Card} from "react-bootstrap";
import * as yup from 'yup';
import {Formik} from 'formik';
import {useHistory} from "react-router-dom";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {forgotPassword} from "../../services/auth/authActions";
import {connect} from "react-redux";
import ToastMessage from "../custom/ToastMessage";

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Неверный формат почты').required('Почта обязательна'),
});

const ForgotPassword = ({forgotPassword}) => {
    const history = useHistory();
    const [toast, setToast] = useState({show: false, message: "", type: ""});

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            await forgotPassword(values.email);
            setToast({
                show: true,
                message: "Инструкция для сброса пароля успешно отправлена вам на почту. Если письмо не поступило, проверьте папку спам или введеную почту.",
                type: "success"
            });
            setTimeout(() => {
                setToast({show: false, message: "", type: ""});
                history.push("/login");
            }, 2500);
        } catch (error) {
            const errorMsg = error.response?.data.message || "Ошибка при сбросе пароля";
            setToast({show: true, message: errorMsg, type: "error"});
            setTimeout(() => {
                setToast({show: false, message: "", type: ""});
            }, 1500);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{width: "400px"}}>
                <ToastMessage show={toast.show} message={toast.message} type={toast.type}/>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                onClick={() => history.goBack()}
                                style={{cursor: "pointer"}}
                            />
                            Сброс пароля
                        </div>
                    </Card.Header>
                    <Formik
                        initialValues={{email: ''}}
                        validationSchema={forgotPasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        {({handleSubmit, handleChange, values, errors, isSubmitting}) => (
                            <Form onSubmit={handleSubmit} noValidate>
                                <Card.Body>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>Почта</Form.Label>
                                        <div style={{position: 'relative'}}>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                isInvalid={!!errors.email}
                                                placeholder="Введите почту"
                                            />
                                            <Form.Control.Feedback type="invalid" style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '0'
                                            }}>
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                                <Card.Footer style={{textAlign: "right"}}>
                                    <Button size="md" variant="danger" type="submit" className="w-100"
                                            disabled={isSubmitting}>
                                        Отправить
                                    </Button>
                                </Card.Footer>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: (userData) => dispatch(forgotPassword(userData)),
    };
};

export default connect(null, mapDispatchToProps)(ForgotPassword);
