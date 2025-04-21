export const sessions = [
  {
    id: '1',
    title: 'Tamil Murli Ilford Evening',
    category: 'Murli',
    date: 'Sun 30 Jun 2024',
    time: '17:30',
    status: 'AUTO',
    zoomCount: 18,
    zoomLink: '(I)',
  },
  {
    id: '2',
    title: 'Tamil Murli Ilford 12.30pm',
    category: 'Murli',
    date: 'Sun 30 Jun 2024',
    time: '12:30',
    status: 'AUTO',
    zoomCount: 10,
    zoomLink: '(I)',
  },
  {
    id: '3',
    title: 'Tamil Murli 10.30',
    category: 'Murli',
    date: 'Sun 30 Jun 2024',
    time: '10:30',
    status: 'AUTO',
    zoomCount: 22,
    zoomLink: '(I)',
  },
   {
    id: '4',
    title: 'Tamil Murli Sun', // Assuming based on pattern
    category: 'Murli',
    date: 'Sun 30 Jun 2024',
    time: '08:00', // Placeholder time
    status: 'AUTO',
    zoomCount: 15, // Placeholder count
    zoomLink: '(I)',
  },
];

export const filters = {
  categories: ['Preferred', 'All', 'Murli'],
  status: ['With Issues (Manual)', 'With Issues (Intg)', 'Cancelled'],
  languages: ['English', 'Hindi', 'Tamil', 'French'], // Added French based on partial view
};

export const calendarData = {
  month: 'June 2024',
  days: [
    ['', '', '', '', '', '', '1'],
    ['2', '3', '4', '5', '6', '7', '8'],
    ['9', '10', '11', '12', '13', '14', '15'],
    ['16', '17', '18', '19', '20', '21', '22'],
    ['23', '24', '25', '26', '27', '28', '29'],
    ['30', '1', '2', '3', '4', '5', '6'], // Dates for the next month shown in grey
  ],
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: '30',
}; 