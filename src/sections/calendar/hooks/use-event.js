import { useMemo } from 'react';
import merge from 'lodash/merge';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

export default function useEvent(data, selectEventId, selectedRange, openForm) {
  const currentEvent = data?.find((event) => event?._id === selectEventId);
  const defaultValues = useMemo(
    () => ({
      // id: '',
      event: "",
      description: '',
      event_type: '',
      company_id: '',
      leave_status: '',
      reason: '',
      from: selectedRange ? selectedRange.start : new Date().getTime(),
      to: selectedRange ? selectedRange.end : new Date().getTime(),


      // title: '',
      // description: '',
      // color: CALENDAR_COLOR_OPTIONS[1],
      // allDay: false,
      // start: selectedRange ? selectedRange.start : new Date().getTime(),
      // end: selectedRange ? selectedRange.end : new Date().getTime(),
    }),
    [selectedRange]
  );

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  return defaultValues;
}
