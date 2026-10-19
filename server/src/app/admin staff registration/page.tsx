/**
 * Admin - Staff Registration ( React + TypeScript)
 *
 * Exports
 *   default StaffRegistration  Admin form: name, email, role -> POST /api/admin/staff
 *   AcceptInvite               Page opened from the emailed link: staff set their own password
 *
 * Works with the API in staff-registration.ts (same endpoints). Proxy /api to the server in dev.
 * The role check below only hides the UI; the server enforces the real permission.
 *
 * Suggested commit message:
 *   feat(admin): add staff registration form and accept-invite page
 */
import { useState, type ChangeEvent, type FormEvent } from 'react';

// ───────────────────────── types + constants ─────────────────────────
export type Role = 'STAFF' | 'SUPPORT' | 'MANAGER';
type Values = { fullName: string; email: string; role: Role };
type Errors = Partial<Record<keyof Values | 'form', string>>;

const ROLES: { value: Role; label: string }[] = [
  { value: 'STAFF', label: 'Staff' },
  { value: 'SUPPORT', label: 'Support' },
  { value: 'MANAGER', label: 'Manager' },
];
const EMPTY: Values = { fullName: '', email: '', role: 'STAFF' };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 12;

// ───────────────────────── validation ─────────────────────────
function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Enter the full name.';
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid work email.';
  if (!ROLES.some(r => r.value === v.role)) e.role = 'Choose a role.';
  return e;
}

// ───────────────────────── api ─────────────────────────
type ApiResult = { ok: true } | { ok: false; errors: Errors };

async function post(path: string, body: object, token?: string): Promise<{ status: number; data: any }> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function createStaff(token: string, v: Values): Promise<ApiResult> {
  try {
    const { status, data } = await post('/admin/staff', v, token);
    if (status === 201) return { ok: true };
    const errors: Errors = {};
    for (const [k, msgs] of Object.entries(data.errors ?? {})) errors[k as keyof Errors] = (msgs as string[])[0];
    if (data.error) errors.form = data.error;
    if (!Object.keys(errors).length) errors.form = 'Could not create the account. Try again.';
    return { ok: false, errors };
  } catch {
    return { ok: false, errors: { form: 'Network error. Check your connection and try again.' } };
  }
}

// ───────────────────────── styles ─────────────────────────
const s = {
  card: { maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 } as const,
  input: { display: 'block', width: '100%', boxSizing: 'border-box', height: 44, marginTop: 6, padding: '0 12px', font: 'inherit' } as const,
  error: { display: 'block', marginTop: 6, fontSize: 14, color: '#A4262C' } as const,
  ok: { color: '#0A4F49' } as const,
};

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? <span id={id} style={s.error}>{text}</span> : null;
}

// ───────────────────────── admin form ─────────────────────────
export default function StaffRegistration({ token, userRole }: { token: string; userRole: string }) {
  const [form, setForm] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (userRole !== 'ADMIN') return <p>You do not have access to staff registration.</p>;

  const text = (k: 'fullName' | 'email') => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    const result = await createStaff(token, form);
    setBusy(false);
    if (result.ok) { setSentTo(form.email.trim()); setForm(EMPTY); }
    else setErrors(result.errors);
  };

  if (sentTo) return (
    <div style={s.card}>
      <p role="status" style={s.ok}>Invite sent to {sentTo}. It expires in 48 hours.</p>
      <button type="button" onClick={() => setSentTo(null)}>Add another staff member</button>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate style={s.card}>
      <h2>Register staff</h2>
      {errors.form && <span role="alert" style={s.error}>{errors.form}</span>}

      <label>Full name
        <input style={s.input} value={form.fullName} onChange={text('fullName')} maxLength={100}
               aria-invalid={!!errors.fullName} aria-describedby="err-name" />
        <FieldError id="err-name" text={errors.fullName} />
      </label>

      <label>Work email
        <input style={s.input} type="email" value={form.email} onChange={text('email')}
               aria-invalid={!!errors.email} aria-describedby="err-email" />
        <FieldError id="err-email" text={errors.email} />
      </label>

      <label>Role
        <select style={s.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}
                aria-invalid={!!errors.role} aria-describedby="err-role">
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <FieldError id="err-role" text={errors.role} />
      </label>

      <button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send invite'}</button>
    </form>
  );
}

// ───────────────────────── accept invite (staff sets password) ─────────────────────────
export function AcceptInvite() {
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`Use at least ${MIN_PASSWORD} characters.`);
    if (password !== confirm) return setError('Passwords do not match.');
    try {
      const { status, data } = await post('/auth/accept-invite', { token, password });
      if (status === 200) setDone(true);
      else setError(data.error ?? 'This invite is invalid or has expired. Ask an admin to resend it.');
    } catch {
      setError('Network error. Check your connection and try again.');
    }
  };

  if (done) return <p role="status" style={s.ok}>Password set. Your account is active. <a href="/">Log in</a></p>;

  return (
    <form onSubmit={submit} style={s.card}>
      <h2>Set your password</h2>
      {error && <span role="alert" style={s.error}>{error}</span>}
      <label>New password ({MIN_PASSWORD}+ characters)
        <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
      </label>
      <label>Confirm password
        <input style={s.input} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
      </label>
      <button type="submit">Activate account</button>
    </form>
  );
}
