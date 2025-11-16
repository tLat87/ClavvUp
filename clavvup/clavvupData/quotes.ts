import { Quote } from '../clavvupTypes';

export const dailyQuotes: Quote[] = [
  { text: 'Small steps, real change.' },
  { text: 'Progress, not perfection.' },
  { text: 'You are stronger than you think.' },
  { text: 'Every day is a fresh start.' },
  { text: 'Believe in yourself and all that you are.' },
  { text: 'The only way to do great work is to love what you do.' },
  { text: 'You don\'t have to be great to start, but you have to start to be great.' },
  { text: 'Success is the sum of small efforts repeated day in and day out.' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.' },
  { text: 'It always seems impossible until it\'s done.' },
  { text: 'You are capable of amazing things.' },
  { text: 'Focus on progress, not perfection.' },
  { text: 'Your potential is limitless.' },
  { text: 'Every accomplishment starts with the decision to try.' },
  { text: 'Be yourself; everyone else is already taken.' },
];

export function getQuoteOfTheDay(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}



