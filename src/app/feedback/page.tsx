import { redirect } from 'next/navigation';

// Redirect /feedback to the Allos Beta Feedback Google Form
// To update the form URL, change FORM_URL below
const FORM_URL = 'https://docs.google.com/forms/d/1ZXTPaAO2No-aflcPqoV4_IDpJ5akvxvxDReas7ivoj8/viewform';

export const metadata = {
  title: 'Allos Beta Feedback',
  description: 'Share your feedback on Allos — your input shapes what we build next.',
};

export default function FeedbackPage() {
  redirect(FORM_URL);
}
