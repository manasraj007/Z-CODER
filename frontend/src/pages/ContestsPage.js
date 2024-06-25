import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './ContestsPage.css';

const ContestsPage = () => {
  const [events, setEvents] = useState([]);
  const apiKey = 'a53dccc9b35c8f1a8ddf3763a0ad4aea864071db'; // Replace with your actual API key

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('https://clist.by/api/v4/contest/', {
          headers: {
            'Authorization': `ApiKey manasraj:${apiKey}` 
          },
          params: {
            start__gte: new Date().toISOString(), // Fetch contests starting from now
            order_by: 'start'
          }
        });

        const contests = response.data.objects
        .filter(contest => {
          const resource = new URL(contest.href).hostname;
          return ['leetcode.com', 'codeforces.com', 'atcoder.jp','codechef.com'].includes(resource);
        })
        .map(contest => ({
          title: contest.event,
          start: new Date(contest.start).toISOString(),
          end: new Date(contest.end).toISOString(),
          url: contest.href,
        }));

        setEvents(contests);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();

    const intervalId = setInterval(fetchContests, 60000); // Update every 60 seconds
    return () => clearInterval(intervalId);
  }, [apiKey]);

  return (
    <div className="contests-page">
      <h1>Upcoming Coding Contests</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            window.open(info.event.url, '_blank');
          }
        }}
      />
    </div>
  );
};

export default ContestsPage;
