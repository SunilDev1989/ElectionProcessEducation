import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // In a real application, you would use the googleapis package here
    // import { google } from 'googleapis';
    // const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_CALENDAR_API_KEY });
    
    // For the hackathon, returning a structured mock response for the timeline is often faster
    // unless you specifically need to pull live data from a real Google Calendar.
    const mockElectionEvents = [
      { id: 1, name: 'Release of Official Notification', date: '2024-03-15T00:00:00.000Z', type: 'registration' },
      { id: 2, name: 'Last Date for Filing Nominations', date: '2024-03-25T00:00:00.000Z', type: 'deadline' },
      { id: 3, name: 'Phase 1 Polling (Lok Sabha)', date: '2024-04-19T00:00:00.000Z', type: 'voting' },
      { id: 4, name: 'Phase 7 Polling (Final)', date: '2024-06-01T00:00:00.000Z', type: 'voting' },
      { id: 5, name: 'Counting of Votes & Results', date: '2024-06-04T00:00:00.000Z', type: 'election' },
    ];

    return NextResponse.json({ events: mockElectionEvents });
  } catch (error) {
    console.error("Calendar API Error:", error);
    return NextResponse.json({ error: "Failed to fetch calendar events." }, { status: 500 });
  }
}
