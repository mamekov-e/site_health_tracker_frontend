import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Tooltip} from "chart.js";

import 'chartjs-adapter-date-fns';
import {Line} from "react-chartjs-2";
import {getTodayDate, parseDatesInArray} from "../../utils/dateUtil";
import {convertStatusesToBinaryArr} from "../../utils/statusConverter";
import axios from "axios";
import ToastMessage from "../custom/ToastMessage";


ChartJS.register(
    LineElement,
    TimeScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend);

const SiteCheckLogsModal = ({handleModalClose, siteCheckModalShow, site}) => {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Статус сайта",
                data: [],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    });
    const [show, setShow] = useState(false);

    const updateChartData = (newLabels, newData) => {
        setChartData((prevState) => ({
            ...prevState,
            labels: newLabels,
            datasets: [
                {
                    ...prevState.datasets[0],
                    data: newData,
                },
            ],
        }));
    }

    useEffect(() => {
        if (site.id) {
            findAllSiteCheckLogsByDate(selectedDate)
        }
    }, [])

    const findAllSiteCheckLogsByDate = async (date) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/v1/site-check-logs/${site.id}?date=${date}`
            );
            const data = response.data;

            if (!data.length) {
                setShow(true)
                setTimeout(() => {
                    setShow(false)
                    updateChartData([], [])
                }, 4000)
                return;
            }

            const allData = convertStatusesToBinaryArr(data);
            const labels = parseDatesInArray(data);

            updateChartData(labels, allData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await findAllSiteCheckLogsByDate(selectedDate)
    };

    const chartOptions = {
        scales: {
            x: {
                type: "time",
                time: {
                    parser: "HH:mm:ss",
                    unit: "second",
                    displayFormats: {
                        second: "HH:mm:ss",
                    },
                },
                ticks: {
                    font: {
                        size: 14
                    },
                    min: "00:00:00",
                    max: "23:59:59",
                },
                title: {
                    display: true,
                    text: "Периодичность проверки",
                    font: {
                        size: 16
                    }
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Статус сайта",
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    stepSize: 1,
                    callback: (value) => (value === 1 ? "Доступен" : "Недоступен"),
                },
            },
        }
    };

    return (
        <>
            <div style={{display: show ? "block" : "none"}}>
                <ToastMessage
                    show={show}
                    message={"Нет записей на эту дату"}
                    type={"danger"}
                />
            </div>
            <Modal show={siteCheckModalShow}
                   dialogClassName={"my-modal text-light"}
                   onHide={handleModalClose}>
                <Modal.Header className={"modal-content flex-row"}>
                    <Modal.Title>История проверки сайта на доступность | {site.name}</Modal.Title>
                    <Button variant="secondary" className={"float-right"} onClick={handleModalClose}>
                        Закрыть
                    </Button>
                </Modal.Header>
                <Modal.Body className={"text-center"}>
                    <div className={"date-select-panel"}>
                        <Form onSubmit={handleSubmit}
                              className={"w-75 d-flex h-25 justify-content-center align-items-end"}>
                            <Form.Group controlId="datePicker" className={"date-select-form"}>
                                <Form.Label>Выберите дату:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    max={getTodayDate()}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value)
                                    }}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Найти
                            </Button>
                        </Form>
                    </div>
                    {chartData ? (
                            <div style={{marginTop: "20px"}}>
                                <Line data={chartData} options={chartOptions}/>
                            </div>)
                        : <h5>Нет данных</h5>
                    }
                    <div style={{height: "30px"}}></div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SiteCheckLogsModal;
