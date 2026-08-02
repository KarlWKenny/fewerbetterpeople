import { useState } from 'preact/hooks';

/**
 * STUB — proves the island pattern compiles and hydrates. Not the tool.
 *
 * TODO — intended first tool: an owner-vs-operator diagnostic.
 *  - ~10 questions scoring how much of the business still routes through
 *    the owner (approvals, pricing, hiring, customer relationships, cash).
 *  - Produces a score band ("operator" → "owner") with a short read-out
 *    per band, rendered client-side.
 *  - Captures an email to send the full result; POST to a Pages Function
 *    at /functions/api/diagnostic.ts (does not exist yet — see README
 *    "Server endpoints"). No third-party form service.
 *  - Plain language throughout; no gamification, no animated counters.
 *
 * This component is loaded with client:visible on /tools/owner-operator-
 * diagnostic only — no global framework runtime ships on other pages.
 */
export default function OwnerOperatorDiagnostic() {
  const [started, setStarted] = useState(false);

  return (
    <div class="diagnostic-stub">
      {started ? (
        <p>
          The diagnostic isn't built yet. This island exists to prove the
          interactive pattern works — the questions come later.
        </p>
      ) : (
        <button type="button" onClick={() => setStarted(true)}>
          Start the diagnostic
        </button>
      )}
    </div>
  );
}
