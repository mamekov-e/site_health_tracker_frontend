import React from "react";
import {Toast} from "react-bootstrap";

const ToastMessage = (props) => {
    const toastCss = {
        position: "fixed",
        top: "10%",
        right: "40%",
        zIndex: "9999",
        boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
        <div style={props.show ? toastCss : null}>
            <Toast
                className={`border text-white ${
                    props.type === "success"
                        ? "border-success bg-success"
                        : "border-danger bg-danger"
                }`}
                show={props.show}
            >
                <Toast.Header
                    className={`text-white ${
                        props.type === "success" ? "bg-success" : "bg-danger"
                    }`}
                    closeButton={false}
                >
                    <strong className="mr-auto">{props.error ? props.error : "Выполнено"}</strong>
                </Toast.Header>
                <Toast.Body>{props.message}</Toast.Body>
            </Toast>
        </div>
    );
};

export default ToastMessage;