import React, { useMemo, useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Link } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { get, post } from "../../../app/components/api";
import ApexChart from "../../../app/components/ApexChart";

function ReusableTable({ clientData }) {
  return (
    <Table responsive>
      <thead>
        <tr>
          <td>Owner Name</td>
          <td>Mobile No.</td>
          <td>Email</td>
          <td>Vehicles</td>
        </tr>
      </thead>
      <tbody>
        {clientData.length > 0 &&
          clientData.map((client, index) => (
            <tr key={index}>
              <td>{client.ownerName}</td>
              <td>
                <a className="text-underline" href={`tel:${client.mobileNo}`}>
                  {client.mobileNo}
                </a>
              </td>
              <td>
                <a className="text-underline" href={`mailto:${client.email}`}>
                  {client.email}
                </a>
              </td>
              <td>
                {client.count > 1
                  ? `${client.count} Trucks`
                  : `${client.count} Truck`}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

export function Dashboard() {
  const isInitialRender = useRef(true);
  const type = "bar";
  const height = 350;
  const [dashboardData, setDashboardData] = useState("");
  const [gpsData, setGpsData] = useState("");
  const [simData, setSimData] = useState("");
  // sales data
  const [startDate, setStartDate] = useState(moment().toDate());
  // device expired data
  const [subStartDate, setSubStartDate] = useState(moment().toDate());
  const [salesChartData, setSalesChartData] = useState({});
  const [salesChartOptions, setSalesChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [planExpireChartData, setPlanExpireChartData] = useState([]);
  const currentDate = moment();
  const currentYear = moment(currentDate).toDate();
  const lastYear = moment(currentDate)
    .subtract(1, "year")
    .toDate();
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState("gps");

  const fetchData = async () => {
    try {
      const response = await get("/superadmin/dashboard-data");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const fetchSalesData = async () => {
    try {
      const selectedYear = moment(startDate).year();
      const response = await post("/superadmin/sales-history-by-year", {
        year: selectedYear,
      });
      if (response.status == 200) {
        let tempSalesChartData = { ...salesChartData };
        tempSalesChartData.gps = Object.values(response?.data?.gps);
        tempSalesChartData.fuelSensor = Object.values(
          response?.data?.fuelSensor
        );
        return tempSalesChartData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubscriptionData = async (selectedDate) => {
    try {
      const selectedYear = moment(selectedDate).year();
      const response = await post("/superadmin/subscription-expired", {
        year: selectedYear,
      });
      if (response.status == 200) {
        setPlanExpireChartData({
          data: response.data, // Monthly expired data
          totalDevice: response.totalDevice, // Total devices count
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      let chartData = await fetchData();
      let newData = await fetchSalesData();
      if (chartData?.status == 200) {
        setDashboardData(chartData.data);
        setSalesChartData(newData);
      }
      setIsLoading(false);
    };
    fetchDataAsync();
  }, []);

  useEffect(() => {
    if (key === "gps") {
      const devicesData =
        dashboardData &&
        dashboardData?.inventoryData &&
        dashboardData?.inventoryData?.devices;
      const deviceChartSeries = Object.values(devicesData);
      console.log("devicesData", Object.keys(devicesData));
      const deviceChartOptions = {
        chart: {
          width: 480,
          type: "pie",
          toolbar: {
            show: true,
            tools: {
              download: true,
            },
          },
        },
        labels: Object.keys(devicesData),
        legend: {
          position: "left",
          horizontalAlign: "top",
          fontSize: "12px",
          fontWeight: 600,
          markers: {
            width: 14,
            height: 14,
            radius: 0,
          },
          itemMargin: {
            vertical: 5,
          },
        },
        colors: ["#10A142", "#F29425"],
        responsive: [
          {
            breakpoint: 380,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
      setGpsData({
        series: deviceChartSeries,
        options: deviceChartOptions,
      });
    } else if (key === "sim") {
      const simData =
        dashboardData &&
        dashboardData?.inventoryData &&
        dashboardData?.inventoryData?.sim;
      const simChartSeries = Object.values(simData);
      const simChartOptions = {
        chart: {
          width: 480,
          type: "pie",
          toolbar: {
            show: true,
            tools: {
              download: true,
            },
          },
        },
        labels: Object.keys(simData),
        legend: {
          position: "left",
          horizontalAlign: "top",
          fontSize: "12px",
          fontWeight: 600,
          markers: {
            width: 14,
            height: 14,
            radius: 0,
          },
          itemMargin: {
            vertical: 5,
          },
        },
        colors: ["#10A142", "#34817B"],
        responsive: [
          {
            breakpoint: 380,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
      setSimData({
        series: simChartSeries,
        options: simChartOptions,
      });
    }
  }, [key, dashboardData]);

  // sales chart data
  useEffect(() => {
    const fetchAsync = async () => {
      const newData = await fetchSalesData();
      if (newData) {
        setSalesChartData(newData);
      }
    };
    fetchAsync();
  }, [startDate]);

  // subscription chart data
  useEffect(() => {
    fetchSubscriptionData(subStartDate);
  }, [subStartDate]);

  const hasValidgpsFuelData =
    salesChartData?.gps?.length > 0 && salesChartData?.fuelSensor?.length > 0;
  // sales history chart
  const debouncedSetChartOptions = debounce((data) => {
    setSalesChartOptions({
      chart: {
        id: "sales-history-chart",
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        title: { text: "Sales" },
      },
      tooltip: {
        x: {
          formatter: function(val) {
            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            return `${months[val - 1]} Sales`; // Convert number to corresponding month name
          },
        },
      },
      dataLabels: { enabled: true },
      title: {
        text: `Sales from ${moment(startDate)
          .startOf("year")
          .format("Do MMM")} to ${
          moment(startDate).year() === moment().year()
            ? moment().format("Do MMM YYYY")
            : moment(startDate)
                .endOf("year")
                .format("Do MMM YYYY")
        }`,
      },
      legend: {
        horizontalAlign: "center",
        fontSize: "12px",
        fontWeight: 600,
        markers: { width: 14, height: 14, radius: 0 },
        itemMargin: { vertical: 5 },
      },
      colors: ["#34817B", "#10A142"],
    });
  }, 1000);
  // Debounced function to set chart series
  const debouncedSetChartSeries = debounce((data) => {
    setChartSeries(
      hasValidgpsFuelData
        ? [
            { name: "GPS Devices", data: data?.gps || [] },
            { name: "Fuel Sensors", data: data?.fuelSensor || [] },
          ]
        : []
    );
  }, 1000);

  useEffect(() => {
    debouncedSetChartOptions(salesChartData);
    debouncedSetChartSeries(salesChartData);
  }, [salesChartData, hasValidgpsFuelData]);

  const series = useMemo(
    () => [
      {
        name: "Expired Devices",
        data: Object.values(planExpireChartData.data || {}), // Monthly expired devices
        color: "#E54F53", // Red
      },
    ],
    [planExpireChartData]
  );
  console.log(planExpireChartData);

  const options = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
        // stackType: "100%",
        toolbar: {
          show: false,
          tools: {
            download: true,
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: Object.keys(planExpireChartData.data || {}),
      },
      yaxis: {
        title: { text: "No of Devices" },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        position: "top",
        offsetX: 0,
        offsetY: 0,
      },
      colors: ["#34817B", "#E54F53"],
    }),
    [planExpireChartData]
  );

  return (
    <div>
      <div className="w-100 d-flex justify-content-between">
        <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded width_18">
          <div className="p-2">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">
                {dashboardData.clientsCount ? dashboardData.clientsCount : 0}
              </h2>
              <img
                src={toAbsoluteUrl("/media/dashboard/clients_image.png")}
                alt=""
                width={"35px"}
                height={"25px"}
              />
            </div>
            <div>
              <p className="mb-0 mt-4">Total FleetOwners</p>
            </div>
          </div>
        </div>
        <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded width_18">
          <div className="p-2">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">
                {dashboardData.vehiclesCount ? dashboardData.vehiclesCount : 0}
              </h2>
              <img
                src={toAbsoluteUrl("/media/dashboard/vehicles.png")}
                alt=""
                width={"35px"}
                height={"25px"}
              />
            </div>
            <div>
              <p className="mb-0 mt-4">Total Vehicles</p>
            </div>
          </div>
        </div>
        <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded width_18">
          <div className="p-2">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">
                {dashboardData.closeIssues ? dashboardData.closeIssues : 0}
              </h2>
              <img
                src={toAbsoluteUrl("/media/dashboard/closed_issues.png")}
                alt=""
                width={"35px"}
                height={"25px"}
              />
            </div>
            <div>
              <p className="mb-0 mt-4">Closed Issues</p>
            </div>
          </div>
        </div>
        <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded width_18">
          <div className="p-2">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">
                {dashboardData.openIssues ? dashboardData.openIssues : 0}
              </h2>
              <img
                src={toAbsoluteUrl("/media/dashboard/open_issues.png")}
                alt=""
                width={"35px"}
                height={"25px"}
              />
            </div>
            <div>
              <p className="mb-0 mt-4">Open Issues</p>
            </div>
          </div>
        </div>
        <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded width_18">
          <div className="p-2">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">
                {dashboardData.inProcessIssues
                  ? dashboardData.inProcessIssues
                  : 0}
              </h2>
              <img
                src={toAbsoluteUrl("/media/dashboard/inprocess_issues.png")}
                alt=""
                width={"35px"}
                height={"25px"}
              />
            </div>
            <div>
              <p className="mb-0 mt-4">In Process</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-lg-6">
          <div className="shadow-sm bg-white p-3 mb-5 bg-body h-95 rounded w-100">
            <div className="d-flex justify-content-between">
              <h2 className="dashboard-title">Our Inventory</h2>
            </div>
            <div className="mt-4">
              <Tab.Container id="left-tabs-example" defaultActiveKey="gps">
                <Row>
                  <Col sm={3}>
                    <Nav
                      variant="pills"
                      className="flex-column"
                      onSelect={(k) => setKey(k)}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="gps">GPS Devices</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="sim">Sim Cards</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey={key === "gps" ? "gps" : "sim"}>
                        <div className="pi-chart-wrapper">
                          {key === "gps" && gpsData !== "" && (
                            <ApexChart
                              options={gpsData?.options}
                              series={gpsData?.series}
                              type="pie"
                              id="1"
                            />
                          )}
                          {key === "sim" && simData !== "" && (
                            <ApexChart
                              options={simData?.options}
                              series={simData?.series}
                              type="pie"
                              id="2"
                            />
                          )}
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6">
          <div className="shadow-sm bg-white p-3 mb-5 bg-body h-95 rounded w-100">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 className="dashboard-title">Our FleetOwners</h2>
                <Link to="/fleet-owners">
                  <a style={{ marginRight: "10px" }}>View More</a>
                </Link>
              </div>
              {dashboardData !== "" &&
                dashboardData !== null &&
                dashboardData !== "" &&
                dashboardData.clientData.length > 0 && (
                  <ReusableTable clientData={dashboardData.clientData} />
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-lg-6">
          <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded w-100">
            <div className="d-flex justify-content-between">
              <div>
                <h2 className="dashboard-title">Subscription Expired</h2>
              </div>
              <div className="chart">
                <DatePicker
                  selected={subStartDate}
                  onChange={(date) => setSubStartDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  minDate={lastYear}
                  maxDate={currentYear}
                />
              </div>
            </div>
            <div>
              <ApexChart
                options={options}
                series={series}
                type={type}
                id="4"
                height={height}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6">
          <div className="shadow-sm bg-white p-3 mb-5 bg-body rounded w-100">
            <div className="d-flex justify-content-between">
              <div>
                <h2 className="dashboard-title">Sales History</h2>
              </div>
              <div className="chart">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  minDate={lastYear}
                  maxDate={currentYear}
                />
              </div>
            </div>
            <div>
              <ApexChart
                options={salesChartOptions}
                series={chartSeries}
                id="3"
                type="line"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
