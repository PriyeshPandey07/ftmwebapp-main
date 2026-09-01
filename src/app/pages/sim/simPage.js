import React, { useEffect, useState, useRef } from "react";
import moment from 'moment';
import { useSelector } from "react-redux";
import PublishIcon from '@material-ui/icons/Publish';
import { sortCaret, toAbsoluteUrl } from "../../../_metronic/_helpers";
import { post } from "../../components/api";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import {SweetAlert} from '../../utils/helper';
import ReusableTable from "../../components/ReusableTable";
import Loading from "../../components/LoadingComponent";
import { Spinner } from "react-bootstrap";
import SVG from 'react-inlinesvg'
import debounceSearchParams from "../../components/debounce";
import {Search} from 'react-bootstrap-icons'


function SimPage({ history }) {
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  const columns = [
    {
      dataField: "MOBILE_NUMBER",
      text: "Mobile Number",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "SIM_NO",
      text: "Sim No",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "SIM_IMSI",
      text: "Sim IMSI",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "SIM_STATUS",
      text: "Sim Status",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "PLAN_NAME",
      text: "Plan Name",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "STATUS",
      text: "Status",
      formatter: (cell) => {
        return (
          <span
            className={
              cell === "Activate"
                ? `label label-lg label-light-success label-inline`
                : cell === "Deactivate" ? `label label-lg label-light-danger label-inline` : `label label-lg label-light-warning label-inline`
            }
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "updated_at",
      text: "Updated At",
      formatter: (cell) => {
        return <span>{moment(cell).format("DD/MM/YYYY hh:mm A")}</span>;
      }
    }
  ];

  const fileInputRef = useRef(null);
  const [simData, setSimData] = useState("");
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 10,
    },
    query: {
      search: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await post("/superadmin/sim-data", filters);
      if (response.status == 200) {
        setSimData(response.data);
        setIsLoading(false);
        setIsBtnLoading(false);
      } else {
        setSimData("");
        setIsLoading(false);
        setIsBtnLoading(false)
      }
    } catch (error) {
      // Handle error
      console.log(error);
      setIsLoading(false);
      setIsBtnLoading(false)
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [filters.options.page || filters.options.limit]);

  useEffect(()=> {
    const timeoutId = setTimeout(() => {
      debounceSearchParams(fetchData, 1000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters.query, 1000])

  // update pagination options
  const updatepaginationOptions = (options) => {
    let tempFilters = {...filters}
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    setFilters(tempFilters);
  }

  // file upload 
  const handleFileUpload = async (event, name) => {
    event.preventDefault()
    let file = event.target.files[0];
    let fileType = file.name.split('.').pop().toLowerCase();
    if (event.target.files.length > 0) {
      if (fileType === 'xlsx' || fileType === 'csv') {
        setIsDisabled(true);
        const formData = new FormData();
        formData.append('file', file);
        const response = await post("/superadmin/sim-data-imports", formData);
        if (response.status == 200) {
          fetchData();
          SweetAlert(response.message, false);
          setIsDisabled(false);
        } else {
          SweetAlert(response.message, true);
          setIsDisabled(false);
        }
      } else {
        SweetAlert("Upload only xlsx or csv file.", true);
      }
    }
  }

  let handleSearchEvent = (value)=> {
    console.log('value ', value);
    setFilters((prevState)=> ({
      ...prevState,
      query: {
        search: value
      }
    }));
    setIsBtnLoading(true)
  }


  return (
    <>
      <div className="sim-upload-btn-parent">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileInputRef.current.click()}
          disabled={isDisabled}
        >
          <input
            name="file"
            accept="*"
            id={`upload-file`}
            type="file"
            ref={fileInputRef}
            hidden
            onChange={(event) => handleFileUpload(event, 'file')}
            onClick={(e)=> { 
              e.target.value = null
            }}
          />
          <PublishIcon />
          Upload File
        </button>
      </div>
      <Card>
      <CardHeader>
        <CardHeaderToolbar className="w-100">
          {/* Hide "Add New User" button if userRole is superadmin" */}
          <div className="d-flex justify-content-start w-100">
              <div className="input-group w_40">
                <div className={`input-group-prepend input-group-prepend-search searchInputHeight`}>
                  <span className="input-group-text search-icon">
                  <span className="svg-icon svg-icon-sm">
                      <Search color="#4CBABA" size={8}/>
                    </span>
                  </span>
                </div>
                <input
                  placeholder="Search..."
                  type="text"
                  name="name"
                  className="form-control searchCustom"
                  style={{"borderColor":"#E4E6EF"}}
                  autoComplete="off"
                  onChange={(e)=> handleSearchEvent(e.target.value)}
                />
                
              </div>
              {isBtnLoading ?
                <span style={{"padding-inline": "10px", "padding-top": "3px"}}><Spinner style={{"textAlign": "center"}} animation="border" variant="success" size="md" /></span>
                    : null}
            </div>
        </CardHeaderToolbar>
      </CardHeader>
        <CardBody>
          <ReusableTable
            data={simData !== '' && simData.docs.length > 0 ? simData.docs : []}
            columns={columns}
            totalSize={simData !== '' && simData.totalDocs !== '' ? simData.totalDocs : 0}
            page = {simData !== '' && simData.page !== '' ? simData.page : 1}
            limit = {simData !== '' && simData.limit !== '' ? simData.limit : 10}
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>
    </>
  );
}

export default SimPage;
