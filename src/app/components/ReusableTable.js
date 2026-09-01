import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { NoRecordsFoundMessage } from "../../_metronic/_helpers";
import { Pagination } from "../../_metronic/_partials/controls";
import Loading from "../components/LoadingComponent";

const ReusableTable = ({
  data,
  columns,
  totalSize,
  page,
  limit,
  updatepaginationOptions,
  isLoading,
}) => {
  const [paginationOptions, setPaginationOptions] = useState({
    sizePerPage: 10,
    totalSize: totalSize,
    page: page,
    custom: true,
    sizePerPage: limit,
  });

  useEffect(() => {
    const tempPaginationOptions = { ...paginationOptions };
    tempPaginationOptions.totalSize = totalSize;
    tempPaginationOptions.page = page;
    tempPaginationOptions.sizePerPage = limit;
    setPaginationOptions(tempPaginationOptions);
  }, [totalSize]);
  useEffect(() => {
    setPaginationOptions((prevOptions) => ({
      ...prevOptions,
      totalSize,
    }));
  }, [totalSize]);
  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    const tempPaginationOptions = { ...paginationOptions };
    tempPaginationOptions.page = page;
    tempPaginationOptions.sizePerPage = sizePerPage;
    tempPaginationOptions.sortField = sortField;
    tempPaginationOptions.sortOrder = sortOrder;
    setPaginationOptions(tempPaginationOptions);
    updatepaginationOptions(tempPaginationOptions);
  };

  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination isLoading={isLoading} paginationProps={paginationProps}>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                remote
                keyField="_id"
                data={data}
                columns={columns}
                defaultSorted="_id"
                onTableChange={handleTableChange}
                {...paginationTableProps}
                noDataIndication={() =>
                  isLoading ? (
                    <Loading />
                  ) : (
                    <NoRecordsFoundMessage entities={data} />
                  )
                }
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
};

export default ReusableTable;
