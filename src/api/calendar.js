import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';
import axios from 'axios';
import { useAuthContext } from '../auth/hooks/index';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;
const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetCalendar(page, limit) {
  const { user } = useAuthContext();
  const calendarURL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user?.company_id}/event`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(calendarURL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      calendar: data || [],
      calendarLoading: isLoading,
      calendarError: error,
      calendarValidating: isValidating,
      calendarEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const events = data?.events?.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events?.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}


// ----------------------------------------------------------------------

export async function createEvent(eventData) {
  const URL = 'https://admin-panel-dmawv.ondigitalocean.app/api/v2/event';
  try {
    const response = await axios.post(URL, eventData);
    const newEvent = response.data;
    mutate(
      URL,
      (currentData) => {
        const events = [...currentData.events, newEvent];
        return {
          ...currentData,
          events,
        };
      },
      false
    );
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData) {
  try {
    const response = await axios.put(
      `https://admin-panel-dmawv.ondigitalocean.app/api/v2/event/${eventData._id}`,
      eventData
    );
    const updatedEvent = response.data;
    mutate(
      URL,
      (currentData) => {
        const events = currentData.events.map((event) =>
          event.id === eventData._id ? updatedEvent : event
        );
        return {
          ...currentData,
          events,
        };
      },
      false
    );
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId) {
  const deleteURL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/event/${eventId}`;
  try {
    await axios.delete(deleteURL);

    mutate(
      URL,
      (currentData) => {
        const updatedEvents = currentData?.events?.filter((event) => event.id !== eventId);
        return { ...currentData, events: updatedEvents };
      },
      false
    );
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}
