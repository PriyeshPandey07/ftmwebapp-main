import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ options, series, type, id, height = 350 }) => {
    try {
        return (
            <div>
                <div id={`chart-${id}`}>
                    <ReactApexChart options={options} series={series} type={type} height={height} />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    } catch (error) {
        console.log('Error rendering chart:', error);
        return <div>Error rendering chart</div>;
    }
};

export default React.memo(ApexChart);
