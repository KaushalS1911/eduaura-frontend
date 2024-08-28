import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import StudentProgrssDetailsFormDialog from './student-progrss-details-form-dialog';
import { useGetConfigs } from '../../api/config';

export default function StudentProgressDetailsHistory({ language, currentStudent, mutate }) {
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();
  const [open, setOpen] = useState(false);
  const [clickedButtons, setClickedButtons] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [completed, setCompleted] = useState({});
  const [completionDate, setCompletionDate] = useState({});
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    if (currentStudent?.course_completed) {
      const initialClickedButtons = {};
      const initialSelectedDates = {};
      const initialCompleted = {};
      const initialCompletionDate = {};

      currentStudent.course_completed.forEach((course) => {
        const index = language.indexOf(course.language.label);
        if (index !== -1) {
          initialClickedButtons[index] = true;
          initialSelectedDates[index] = new Date(course.date) || new Date();
          initialCompleted[index] = true;
          initialCompletionDate[index] = new Date(course.date) || new Date();
        }
      });

      setClickedButtons(initialClickedButtons);
      setSelectedDates(initialSelectedDates);
      setCompleted(initialCompleted);
      setCompletionDate(initialCompletionDate);
    }
  }, [currentStudent, language]);

  useEffect(() => {
    if (configs && currentStudent) {
      const filtercourse = configs.courses.find(
        (course) => course.name === currentStudent.course,
      );
      if (filtercourse) {
        const allCompletedStatus = language.every((lang, index) => {
          const completedCourse = currentStudent.course_completed.find(
            (course) => course.language.label === lang,
          );
          return completedCourse && completed[index];
        });

        setAllCompleted(allCompletedStatus);
      }
    }
  }, [currentStudent, configs, completed, language]);


  const handleButtonClick = (index) => {
    let canComplete = true;
    for (let i = 0; i < index; i++) {
      if (!completed[i]) {
        canComplete = false;
        break;
      }
    }

    if (canComplete) {
      setClickedButtons((prev) => ({ ...prev, [index]: true }));
      setCompleted((prev) => ({ ...prev, [index]: true }));
      setCompletionDate((prev) => ({ ...prev, [index]: selectedDates[index] || new Date() }));
    } else {
      enqueueSnackbar('Complete previous languages first', { variant: 'error' });
    }
  };

  const handleDateChange = (index, date) => {
    setSelectedDates((prev) => ({
      ...prev,
      [index]: date !== null ? date : new Date(),
    }));
    setCompletionDate((prev) => ({
      ...prev,
      [index]: date !== null ? date : new Date(),
    }));
  };

  const handleReset = () => {
    setClickedButtons({});
    setSelectedDates({});
    setCompleted({});
    setCompletionDate({});
    setAllCompleted(false); // Reset the completion status as well
  };

  const handleSubmit = async () => {
    const payload = {
      course_completed: language?.reduce((acc, item, index) => {
        if (completed[index]) {
          acc.push({
            language: { label: item },
            date: completionDate[index] || new Date(),
          });
        }
        return acc;
      }, []),
    };

    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
    try {
      const response = await axios.put(URL, payload);
      enqueueSnackbar(response?.data?.message || 'Progress added successfully', {
        variant: 'success',
      });
      mutate();
    } catch (error) {
      console.error('Failed to update student:', error);
      enqueueSnackbar('Failed to update student', { variant: 'error' });
    }
  };

  const renderTimeline = (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {language.map((item, index) => {
        const isLastItem = index === language?.length - 1;
        const canComplete = index === 0 || completed[index - 1];
        return (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={clickedButtons[index] ? 'primary' : 'grey'} />
              {!isLastItem && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Box>
                  <Typography variant='subtitle2'>{item}</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Box mx={1}>
                      <DatePicker
                        value={selectedDates[index] || new Date()}
                        onChange={(date) => handleDateChange(index, date)}
                        disabled={clickedButtons[index] || !canComplete}
                        sx={{ p: '0px 0px' }}
                      />
                    </Box>
                  </Box>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Box mx={1}>
                      <Button
                        sx={{
                          backgroundColor: clickedButtons[index] ? '#454F5B' : '#212B36',
                          color: 'white',
                          margin: '0px 5px',
                          ':hover': { backgroundColor: '#454F5B', color: 'white' },
                        }}
                        onClick={() => handleButtonClick(index)}
                        disabled={!canComplete || clickedButtons[index]}
                      >
                        {clickedButtons[index] ? 'Completed' : 'Complete'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title='Progress' />
      <Stack
        spacing={3}
        alignItems={{ md: 'flex-start' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ p: 3 }}
      >
        {renderTimeline}
      </Stack>
      <Box display={'flex'} justifyContent={'end'} mx={5} my={2}>
        <Button
          sx={{
            backgroundColor: '#212B36',
            color: 'white',
            margin: '0px 5px',
            ':hover': { backgroundColor: '#454F5B', color: 'white' },
          }}
          onClick={handleReset}
        >
          Reset
        </Button>

        <Button
          sx={{
            backgroundColor: '#212B36',
            color: 'white',
            margin: '0px 5px',
            ':hover': { backgroundColor: '#454F5B', color: 'white' },
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          sx={{
            backgroundColor: '#212B36',
            color: 'white',
            margin: '0px 5px',
            ':hover': { backgroundColor: '#454F5B', color: 'white' },
          }}
          onClick={() => {
            setOpen(true);
          }}
          disabled={!allCompleted}
        >
          Update Status
        </Button>
      </Box>
      <StudentProgrssDetailsFormDialog
        open={open}
        setOpen={setOpen}
        currentStudent={currentStudent}
        mutate={mutate}
      />
    </Card>
  );
}

StudentProgressDetailsHistory.propTypes = {
  language: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStudent: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    course_completed: PropTypes.arrayOf(
      PropTypes.shape({
        language: PropTypes.shape({
          label: PropTypes.string.isRequired,
        }).isRequired,
        date: PropTypes.string,
      }),
    ),
  }).isRequired,
};
