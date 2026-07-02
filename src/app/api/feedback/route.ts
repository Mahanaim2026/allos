import { NextRequest, NextResponse } from 'next/server';

const RECIPIENT = 'courses@mahanaiminstitute.com';

function buildEmailBody(data: Record<string, unknown>): string {
    const f = (v: unknown) => (Array.isArray(v) ? (v as string[]).join(', ') || '(none)' : String(v || '(not answered)'));

    return `
  NEW ALLOS BETA FEEDBACK SUBMISSION
  ===================================
  Submitted: ${new Date().toUTCString()}

  1. Overall satisfaction rating: ${f(data.overallRating)} / 5

  2. Most valuable about Allos:
  ${f(data.mostValuable)}

  3. What could be improved or added:
  ${f(data.improvements)}

  4. Use frequency: ${f(data.useFrequency)}

  5. Features wanted (selected all that apply):
  ${Array.isArray(data.features) && (data.features as string[]).length > 0
      ? (data.features as string[]).map((s: string) => `  - ${s}`).join('\n')
      : '  (none selected)'}

  6. Likelihood to recommend: ${f(data.recommend)}

  7. Other thoughts / prayer requests:
  ${f(data.otherFeedback)}

  8. Respondent email: ${f(data.email)}

  ---
  Sent automatically by Allos beta feedback form.
  `;
  }

export async function POST(req: NextRequest) {
    try {
          const body = await req.json();

          const emailBody = buildEmailBody(body);

          // Use Resend if RESEND_API_KEY is set, otherwise fall back to a log
          const resendKey = process.env.RESEND_API_KEY;

          if (resendKey) {
                  const res = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${resendKey}`,
                                      },
                            body: JSON.stringify({
                                        from: 'Allos Feedback <feedback@allos.app>',
                                        to: [RECIPIENT],
                                        subject: `[Allos Beta Feedback] Rating: ${body.overallRating}/5 — ${new Date().toLocaleDateString()}`,
                                        text: emailBody,
                                      }),
                          });

                  if (!res.ok) {
                            const err = await res.text();
                            console.error('Resend error:', err);
                            return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
                          }
                } else {
                  // Fallback: log to console (visible in Vercel logs)
                  console.log('[ALLOS FEEDBACK SUBMISSION]\n', emailBody);
                }

          // Also store the response in Supabase if available
          try {
                  const { createClient } = await import('@supabase/supabase-js');
                  const supabase = createClient(
                            process.env.NEXT_PUBLIC_SUPABASE_URL!,
                            process.env.SUPABASE_SERVICE_ROLE_KEY!
                          );
                  await supabase.from('feedback_responses').insert([{
                            overall_rating: body.overallRating,
                            most_valuable: body.mostValuable,
                            improvements: body.improvements,
                            use_frequency: body.useFrequency,
                            features: body.features,
                            recommend: body.recommend,
                            other_feedback: body.otherFeedback,
                            respondent_email: body.email,
                            submitted_at: new Date().toISOString(),
                          }]);
                } catch {
                  // Non-fatal: table may not exist yet
                }

          return NextResponse.json({ ok: true });
        } catch (err) {
          console.error('Feedback API error:', err);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
  }
