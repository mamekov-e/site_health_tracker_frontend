import React, { useState } from "react";
import { Form, Button, Card, Col, Row } from "react-bootstrap";
import * as yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from "react-router-dom";
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { registerUser } from "../../services/auth/authActions";
import ToastMessage from "../custom/ToastMessage";

const signupSchema = yup.object().shape({
    email: yup.string().email('Неверный формат почты').required('Почта обязательна'),
    firstName: yup.string().required('Имя обязательно'),
    lastName: yup.string().required('Фамилия обязательна'),
    middleName: yup.string(),
    password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно'),
});

const SignupForm = ({ registerUser }) => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await registerUser(values);
            setToast({ show: true, message: "Аккаунт успешно создан. Подтвердите аккаунт через email.", type: "success" });
            setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                history.push("/login");
            }, 1500);
        } catch (error) {
            const errorMsg = error.response?.data.message || "Ошибка регистрации";
            setToast({ show: true, message: errorMsg, type: "error" });
            setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
            }, 1500);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{ width: "600px" }}>
                <ToastMessage show={toast.show} message={toast.message} type={toast.type} />
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                onClick={() => history.goBack()}
                                style={{ cursor: "pointer" }}
                            />
                            Регистрация
                        </div>
                    </Card.Header>
                    <Formik
                        initialValues={{
                            email: '',
                            firstName: '',
                            lastName: '',
                            middleName: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={signupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
                            <Form onSubmit={handleSubmit} noValidate>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="formFirstName" className="mb-3">
                                                <Form.Label>Имя</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={values.firstName}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.firstName}
                                                        placeholder="Введите имя"
                                                    />
                                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: '0' }}>
                                                        {errors.firstName}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </Form.Group>
                                            <Form.Group controlId="formLastName" className="mb-3">
                                                <Form.Label>Фамилия</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={values.lastName}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.lastName}
                                                        placeholder="Введите фамилию"
                                                    />
                                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: '0' }}>
                                                        {errors.lastName}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </Form.Group>
                                            <Form.Group controlId="formMiddleName" className="mb-3">
                                                <Form.Label>Отчество</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="middleName"
                                                    value={values.middleName}
                                                    onChange={handleChange}
                                                    placeholder="Введите отчество"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formEmail" className="mb-3">
                                                <Form.Label>Почта</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.email}
                                                        placeholder="Введите почту"
                                                    />
                                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: '0' }}>
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </Form.Group>
                                            <Form.Group controlId="formPassword" className="mb-3">
                                                <Form.Label>Пароль</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.password}
                                                        placeholder="Введите пароль"
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showPassword ? faEyeSlash : faEye}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            right: errors.password ? '35px' : '10px', // Adjust based on error presence
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                            color: 'gray'
                                                        }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    />
                                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: '0' }}>
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </Form.Group>
                                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                                <Form.Label>Подтверждение пароля</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={values.confirmPassword}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.confirmPassword}
                                                        placeholder="Подтвердите пароль"
                                                        style={{ paddingRight: '40px' }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showConfirmPassword ? faEyeSlash : faEye}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            right: errors.confirmPassword ? '35px' : '10px', // Adjust based on error presence
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                            color: 'gray'
                                                        }}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    />
                                                    <Form.Control.Feedback type="invalid" style={{ position: 'absolute', top: '100%', left: '0' }}>
                                                        {errors.confirmPassword}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer style={{ textAlign: "right" }}>
                                    <Button variant="info" type="submit" className="w-100" disabled={isSubmitting}>
                                        Зарегистрироваться
                                    </Button>
                                    <div className="mt-3 text-center">
                                        <Button variant="link" onClick={() => history.push('/login')}>
                                            У меня уже есть аккаунт
                                        </Button>
                                    </div>
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
        registerUser: (userData) => dispatch(registerUser(userData)), // Регистрация пользователя
    };
};

export default connect(null, mapDispatchToProps)(SignupForm);
