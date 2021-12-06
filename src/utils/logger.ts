import { TrackerEvent } from "../types";

const events: TrackerEvent[] = [];

export const logEvent = (e: TrackerEvent): TrackerEvent => {
  events.push(e);
  return e;
};

export const getEvents = () => [...events];

export const clearEvents = () => events.splice(0, events.length);
