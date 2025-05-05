import { http, HttpResponse } from 'msw'; // Use http/HttpResponse from MSW v2+

export const handlers = [
  // Example: Intercept GET requests to 'https://api.example.com/message'
  http.get('https://api.example.com/message', () => {
    return HttpResponse.json({ message: 'Hello from MSW!' });
  }),

  // Handler for sessions endpoint
  http.get('https://api.appery.io/rest/1/apiexpress/api/services/core/centres/44/sessions/stats*', ({ request }) => {
    // Check for required headers
    const contentType = request.headers.get('Content-Type');
    const apiExpressKey = request.headers.get('x-appery-api-express-api-key');
    const sessionToken = request.headers.get('x-appery-session-token');
    
    // Log headers for debugging
    console.log('[MSW] Headers received:', { 
      contentType, 
      apiExpressKey: apiExpressKey || 'missing', 
      sessionToken: sessionToken || 'missing' 
    });
    
    // Optional: Validate headers and return error if invalid
    if (!contentType || !apiExpressKey || !sessionToken) {
      console.warn('[MSW] Required headers missing!');
      // Uncomment to enforce header validation
      // return new HttpResponse(null, { status: 401, statusText: 'Unauthorized - Missing required headers' });
    }
    
    // Return mock session data that matches the actual API response structure
    return new HttpResponse(
      JSON.stringify({
        header: {
          pageNum: 2,
          pageSize: 10,
          found: 3878
        },
        results: [
          {
            ROW_NUM: 11,
            eventId: 21894,
            eventName: "Trial recurring session",
            subcatId: 4,
            langCode: "fa",
            eventSessionId: 335784,
            sessionStartsOn: "2025-04-29 11:08:00.0",
            isCancelled: false,
            sourceSystemCode: null,
            num_registrations: null,
            hasIssues: 0,
            isPending: 1,
            isManualSubmitted: 0,
            isIntgSubmitted: 0,
            hasIntgIssues: 0,
            numManualChannels: 1,
            numAutoChannels: 0,
            isAuto: false,
            statusColor: "yellow",
            channels: [
              {
                eventSessionId: 335784,
                channelCode: "TP",
                statsId: null,
                statsNumber: null,
                statsTypeCode: "",
                channelStatusCode: "M",
                channelStatsStatus: "PE"
              }
            ]
          },
          {
            ROW_NUM: 12,
            eventId: 17205,
            eventName: "Hindi Murli",
            subcatId: 1,
            langCode: "hi",
            eventSessionId: 335764,
            sessionStartsOn: "2025-04-29 11:00:00.0",
            isCancelled: false,
            sourceSystemCode: null,
            num_registrations: null,
            hasIssues: 0,
            isPending: 1,
            isManualSubmitted: 0,
            isIntgSubmitted: 0,
            hasIntgIssues: 0,
            numManualChannels: 1,
            numAutoChannels: 0,
            isAuto: false,
            statusColor: "yellow",
            channels: [
              {
                eventSessionId: 335764,
                channelCode: "PH",
                statsId: null,
                statsNumber: null,
                statsTypeCode: "",
                channelStatusCode: "M",
                channelStatsStatus: "PE"
              }
            ]
          },
          {
            ROW_NUM: 13,
            eventId: 9758,
            eventName: "English Murli",
            subcatId: 1,
            langCode: "en",
            eventSessionId: 335543,
            sessionStartsOn: "2025-04-28 18:00:00.0",
            isCancelled: false,
            sourceSystemCode: null,
            num_registrations: null,
            hasIssues: 0,
            isPending: 1,
            isManualSubmitted: 0,
            isIntgSubmitted: 0,
            hasIntgIssues: 0,
            numManualChannels: 1,
            numAutoChannels: 0,
            isAuto: false,
            statusColor: "yellow",
            channels: [
              {
                eventSessionId: 335543,
                channelCode: "PH",
                statsId: null,
                statsNumber: null,
                statsTypeCode: "",
                channelStatusCode: "M",
                channelStatsStatus: "PE"
              }
            ]
          }
        ]
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Add other handlers for your API endpoints here
]; 