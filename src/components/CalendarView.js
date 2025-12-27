import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { requestService } from '../services/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarView.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await requestService.getCalendarRequests();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.scheduledDate);
      return eventDate.toDateString() === date.toDateString();
    });
    setSelectedDayEvents(dayEvents);
  };

  const tileContent = ({ date }) => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.scheduledDate);
      return eventDate.toDateString() === date.toDateString();
    });
    return dayEvents.length > 0 ? <div className="event-dot">{dayEvents.length}</div> : null;
  };

  return (
    <div className="calendar-container">
      <h1>Preventive Maintenance Calendar</h1>
      <div className="calendar-content">
        <div className="calendar-section">
          <Calendar
            value={selectedDate}
            onChange={handleDateClick}
            tileContent={tileContent}
          />
        </div>
        <div className="events-section">
          <h2>Events on {selectedDate.toDateString()}</h2>
          <div className="events-list">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <h3>{event.subject}</h3>
                    <span className={`type ${event.requestType.toLowerCase()}`}>
                      {event.requestType}
                    </span>
                  </div>
                  <div className="event-body">
                    <p><strong>Equipment:</strong> {event.equipment?.name}</p>
                    <p><strong>Team:</strong> {event.maintenanceTeam?.name}</p>
                    {event.assignedTo && (
                      <p><strong>Assigned to:</strong> {event.assignedTo.name}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events">No maintenance scheduled for this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
