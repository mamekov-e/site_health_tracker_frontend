import React, {useState} from "react";
import {Form, Button, Card} from "react-bootstrap";
import * as yup from 'yup';
import {Formik} from 'formik';
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../custom/ToastMessage";
import {loginUser, setAuthenticated} from "../../services/auth/authActions";
import {connect} from "react-redux";

const loginSchema = yup.object().shape({
    email: yup.string().email('Неверный формат почты').required('Почта обязательна'),
    password: yup.string().required('Пароль обязателен'),
});

const SigninForm = ({loginUser, setAuthenticated}) => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({show: false, message: "", type: ""});

    const handleSubmit = async (values) => {
        try {
            await loginUser(values);
            setAuthenticated(true);
            history.push("/sites");
        } catch (error) {
            const errorMsg = error.response?.data.message || "Ошибка авторизации";
            setToast({show: true, message: errorMsg, type: "error"});
            setTimeout(() => {
                setToast({show: false, message: "", type: ""});
            }, 1500);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{width: "400px"}}>
                <ToastMessage show={toast.show} message={toast.message} type={toast.type}/>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div className={"content-header"}>Вход в систему</div>
                    </Card.Header>
                    <Formik
                        initialValues={{email: '', password: ''}}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({handleSubmit, handleChange, values, errors}) => (
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
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Label>Пароль</Form.Label>
                                        <div style={{position: 'relative'}}>
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
                                            <Form.Control.Feedback type="invalid" style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '0'
                                            }}>
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                                <Card.Footer style={{textAlign: "right"}}>
                                    <Button size="md" variant={"light"} type="submit" className="w-100">
                                        Войти
                                    </Button>
                                    <div className="mt-3 text-center">
                                        <Button variant="link" onClick={() => history.push('/register')}>
                                            Нет аккаунта? Создайте
                                        </Button>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <Button variant="link" style={{color: "gray"}}
                                                onClick={() => history.push('/forgot-password')}>
                                            Забыли пароль?
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
        loginUser: (userData) => dispatch(loginUser(userData)),
        setAuthenticated: (status) => dispatch(setAuthenticated(status))
    };
};

export default connect(null, mapDispatchToProps)(SigninForm);
