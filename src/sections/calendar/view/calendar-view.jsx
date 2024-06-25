import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { useState, useEffect, useCallback } from 'react';
import interactionPlugin from '@fullcalendar/interaction';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { isAfter, isBetween } from 'src/utils/format-time';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
import { updateEvent, useGetCalendar, useGetEvents } from 'src/api/calendar';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { StyledCalendar } from '../styles';
import CalendarForm from '../calendar-form';
import { useEvent, useCalendar } from '../hooks';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import CalendarFiltersResult from '../calendar-filters-result';
import { Box } from '@mui/system';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const defaultFilters = {
  colors: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function CalendarView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const smUp = useResponsive('up', 'sm');

  const { user } = useAuthContext();

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { events, eventsLoading } = useGetEvents();

  const { calendar, mutate } = useGetCalendar();
  const { data } = calendar;

  const leaveTypeColors = {
    holiday: '#006099',
    'student leave': '#6B728E',
    notice: '#836FFF',
  };

  const handleLeaveStatusColor = (status) => {
    if (status === 'approve') {
      return '#059212';
    } else {
      return '#C80036';
    }
  };

  const transformedDummyLeave = data?.map((event) => {
    const color =
      event.leave_status === 'approve' || event.leave_status === 'reject'
        ? handleLeaveStatusColor(event.leave_status)
        : leaveTypeColors[event.event_type] || 'gray';
    const textColor =
      event.leave_status === 'approve' || event.leave_status === 'reject'
        ? handleLeaveStatusColor(event.leave_status)
        : leaveTypeColors[event.event_type] || 'gray';

    return {
      ...event,
      start: new Date(event.from),
      end: new Date(event.to),
      title:
        event.user_id._id === user._id
          ? event.event
          : `${event.user_id.firstName} ${event.user_id.lastName} is on ${event.event}`,
      color,
      textColor,
    };
  });

  const dateError = isAfter(filters.startDate, filters.endDate);

  const {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    openForm,
    onOpenForm,
    onCloseForm,
    selectEventId,
    selectedRange,
    onClickEventInFilters,
  } = useCalendar();

  const currentEvent = useEvent(data, selectEventId, selectedRange, openForm);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.startDate && !!filters.endDate;
  const dataFiltered = applyFilter({
    inputData: transformedDummyLeave,
    filters,
    dateError,
  });
  const renderEventContent = (eventInfo) => {
    return (
      <Box
        sx={{
          height: '19px',
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          textOverflow: 'ellipsis',
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  };

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      canReset={canReset}
      onResetFilters={handleResetFilters}
      results={dataFiltered?.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">Calendar</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
          >
            New Event
          </Button>
        </Stack>

        {canReset && renderResults}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              loading={eventsLoading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />
            <Calendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              eventContent={renderEventContent}
              headerToolbar={false}
              select={onSelectRange}
              eventClick={onClickEvent}
              height={smUp ? 720 : 'auto'}
              eventDrop={(arg) => {
                onDropEvent(arg, updateEvent);
              }}
              eventResize={(arg) => {
                onResizeEvent(arg, updateEvent);
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentEvent.event !== '' ? 'Edit Event' : 'Add Event'}</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={onCloseForm}
          mutate={mutate}
        />
      </Dialog>

      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        filters={filters}
        onFilters={handleFilters}
        canReset={canReset}
        onResetFilters={handleResetFilters}
        dateError={dateError}
        events={transformedDummyLeave}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, dateError }) {
  const { colors, startDate, endDate } = filters;
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  inputData = stabilizedThis?.map((el) => el[0]);

  // if (colors.length) {
  //   inputData = inputData.filter((event) => colors.includes(event.color));
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData?.filter((event) => isBetween(event.from, startDate, endDate));
      console.log('input ', inputData);
    }
  }

  return inputData;
}
