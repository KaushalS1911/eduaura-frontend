import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';
import Iconify from 'src/components/iconify';
import Chart from 'src/components/chart';
import { useTheme } from '@mui/material/styles';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Typography } from '@mui/material';
import moment from 'moment';

// const inquiry = [
//   {
//     address: {
//       address_line1: 'aa',
//       address_line2: 'aaa',
//       country: 'Antigua And Barbuda',
//       state: 'Saint George Parish',
//       city: 'Piggotts',
//       zip_code: '778781',
//     },
//     _id: '666293ffbb27580ce7420a04',
//     firstName: 'palak',
//     lastName: 'Sojitra',
//     occupation: 'ss',
//     contact: '+91 72650-78451',
//     email: 'klkk@gmail.com',
//     education: 'aa',
//     dob: '2024-06-13T18:30:00.000Z',
//     reference_by: 'Just Dial',
//     fatherName: 'Himmatbhai',
//     father_contact: '+91 98245 72978',
//     father_occupation: 'Daimond',
//     interested_in: ['Android App', 'Game Development'],
//     suggested_by: 'Self Instrested',
//     company_id: '664ec61d671bf9a7f53664b5',
//     deleted_at: null,
//     createdAt: '2023-06-07T05:00:47.051Z',
//     updatedAt: '2023-06-07T05:52:39.213Z',
//     __v: 0,
//   },
//   {
//     address: {
//       address_line1: 'aa',
//       address_line2: 'aaa',
//       country: 'India',
//       state: 'Gujarat',
//       city: 'Surat',
//       zip_code: '778781',
//     },
//     _id: '66629f95bb27580ce7430377',
//     firstName: 'kal',
//     lastName: 'patel',
//     occupation: 'jkjk',
//     contact: '8956231245',
//     email: 'kall@gmail.cpm',
//     education: 'jkjj',
//     dob: '2024-06-11T18:30:00.000Z',
//     reference_by: 'Just Dial',
//     fatherName: 'arjanbhai',
//     father_contact: '+91 78675 64534',
//     father_occupation: 'Dimond',
//     interested_in: ['Flutter Delelopment', 'Game Development'],
//     suggested_by: 'Suggested by someone',
//     company_id: '664ec61d671bf9a7f53664b5',
//     deleted_at: null,
//     createdAt: '2024-05-07T05:50:13.122Z',
//     updatedAt: '2024-05-07T05:52:27.626Z',
//     __v: 0,
//   },
//   {
//     address: {
//       address_line1: 'aa',
//       address_line2: 'aaa',
//       city: 'Mahuva (Surat)',
//       state: 'Gujarat',
//       country: 'India',
//       zip_code: '2324423',
//     },
//     _id: '6662a0abbb27580ce7430a67',
//     firstName: 'uka',
//     lastName: 'patel',
//     occupation: 'dff',
//     contact: '4512365895',
//     email: 'ula@gmail.com',
//     education: 'klkl',
//     dob: '2024-06-12T18:30:00.000Z',
//     reference_by: 'Just Dial',
//     fatherName: 'wwede',
//     father_contact: '457898956565',
//     father_occupation: 'ss',
//     interested_in: ['Flutter Delelopment', 'Game Development'],
//     suggested_by: 'Suggested by someone',
//     company_id: '664ec61d671bf9a7f53664b5',
//     deleted_at: null,
//     createdAt: '2024-06-07T05:54:51.241Z',
//     updatedAt: '2024-06-07T05:54:51.241Z',
//     __v: 0,
//   },
//   {
//     address: {
//       address_line1: '235',
//       address_line2: '5455',
//       city: 'Surat',
//       state: 'Gujarat',
//       country: 'India',
//       zip_code: '457898',
//     },
//     _id: '66640c11bb27580ce7439c06',
//     firstName: 'hello',
//     lastName: 'world',
//     occupation: '12',
//     contact: '7845652312',
//     email: 'hello@gmail.com',
//     education: 'bca',
//     dob: '2023-01-01T18:30:00.000Z',
//     reference_by: 'Google',
//     fatherName: 'hello',
//     father_contact: '9510951423',
//     father_occupation: 'kjkj',
//     interested_in: ['Flutter Delelopment', 'Game Development'],
//     suggested_by: 'Self Instrested',
//     company_id: '664ec61d671bf9a7f53664b5',
//     deleted_at: null,
//     createdAt: '2024-06-08T07:45:21.936Z',
//     updatedAt: '2024-06-08T07:45:21.936Z',
//     __v: 0,
//   },
//   {
//     address: {
//       address_line1: '22',
//       address_line2: 'surat',
//       city: 'Mahuva (Surat)',
//       state: 'Gujarat',
//       country: 'India',
//       zip_code: '145688',
//     },
//     _id: '666690911602e68c93c48328',
//     firstName: 'jenilk',
//     lastName: 'ael',
//     occupation: '12',
//     contact: '7856231245',
//     email: 'jenil@gmail.com',
//     education: 'bCa',
//     dob: '2024-01-01T18:30:00.000Z',
//     reference_by: 'Social Media',
//     fatherName: 'Gemil',
//     father_contact: '8945235689',
//     father_occupation: 'daimond',
//     interested_in: ['Flutter Delelopment', 'Game Development'],
//     suggested_by: 'Self Instrested',
//     company_id: '664ec61d671bf9a7f53664b5',
//     deleted_at: null,
//     createdAt: '2024-06-10T05:35:13.052Z',
//     updatedAt: '2024-06-10T05:35:13.052Z',
//     __v: 0,
//   },
// ];

const AppAreaInstalled = ({ title, subheader,inquiry, chart:chartProp, ...other }) => {
  const theme = useTheme(); 
  const [option, setOption] = useState('today');
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  const chart = chartProp || {}; 

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
  } = chart;

  const popover = usePopover(); 

  const optionsList = [
    { value: 'today', label: 'Today' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    chart: {
      id: 'bar',
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          color: 'A#fff' 
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          color: 'A#fff' 
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: false,
        barHeight: '20%',
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: 'warning',
            },
          ],
          backgroundBarOpacity: 1,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };
  

  useEffect(() => {
    let filteredData = [];
    if (option === "today") {
      const today = moment().startOf('day');
      const dailyData = {};
      inquiry.forEach((item) => {
        const date = moment(item.createdAt);
        if (date.isSame(today, 'day')) {
          const formattedDate = date.format('YYYY-MM-DD');
          if (!dailyData[formattedDate]) dailyData[formattedDate] = 0;
          dailyData[formattedDate]++;
        }
      });
      setChartData({
        categories: Object.keys(dailyData),
        series: [{ name: "Students", data: Object.values(dailyData) }],
      });
    }   
    else if (option === 'month') {
      const monthlyData = {};
      inquiry.forEach((item) => {
        const month = moment(item.createdAt).format('MMMM');
        if (!monthlyData[month]) monthlyData[month] = 0;
        monthlyData[month]++;
      });
      setChartData({
        categories: moment.months(),
        series: [
          {
            name: 'Students',
            data: moment.months().map((month) => monthlyData[month] || 0),
          },
        ],
      });
    } else if (option === 'year') {
      const yearlyData = {};
      inquiry.forEach((item) => {
        const year = moment(item.createdAt).year();
        if (!yearlyData[year]) yearlyData[year] = 0;
        yearlyData[year]++;
      });
      setChartData({
        categories: Object.keys(yearlyData),
        series: [{ name: 'Students', data: Object.values(yearlyData) }],
      });
    }
  }, [option, inquiry]);

  const handleChangeSeries = (value) => {
    setOption(value);
    popover.onClose();
  };

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <>
              <ButtonBase
                onClick={popover.onOpen}
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {optionsList.find((opt) => opt.value === option)?.label}
                <Iconify
                  width={16}
                  icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
                {optionsList.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    onClick={() => handleChangeSeries(opt.value)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </CustomPopover>
            </>
          }
        />
        <Chart
          options={chartOptions}
          series={chartData.series}
          width="100%"
          height={420}
          dir="ltr"
          type="bar"
        />
      </Card>
    </>
  );
};

AppAreaInstalled.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
  inquiry: PropTypes.array.isRequired,
};

export default AppAreaInstalled;