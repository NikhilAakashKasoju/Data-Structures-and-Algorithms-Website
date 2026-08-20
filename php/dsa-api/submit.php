<?php
declare(strict_types=1);

/**
 * Contact form endpoint — EduFulness DSA.
 *
 * DEPLOY THIS OUTSIDE public_html/dsa/.
 * The deploy step for the site is "delete everything inside public_html/dsa/,
 * then upload out/". A PHP file inside that folder is destroyed on every
 * single deploy. Upload this file to:
 *
 *     public_html/dsa-api/submit.php
 *
 * and set CONTACT.formEndpoint in lib/contact.ts to
 * "https://edufulness.com/dsa-api/submit.php".
 *
 * It answers two callers with the same logic:
 *   - fetch() sending `Accept: application/json`  → JSON  {"ok":true}
 *   - a plain <form> post with JS disabled        → a small HTML page
 *
 * ── BEFORE THIS WORKS, SET THE TWO CONSTANTS BELOW ──────────────────────────
 */

/** Where messages are delivered. REQUIRED — the endpoint refuses to run
 *  until this is a real address. */
const MAIL_TO = '';

/**
 * The From: address. It MUST be a mailbox on this domain. Putting the
 * sender's own address in From: is the classic mistake: edufulness.com does
 * not authorise Gmail to send on its behalf, so SPF/DKIM fail and the mail
 * is binned. The sender's address goes in Reply-To: instead, which is what
 * makes "Reply" in your mail client do the right thing.
 */
const MAIL_FROM = 'no-reply@edufulness.com';

/* ───────────────────────────────────────────────────────────────────────── */

const ALLOWED_ORIGINS = [
    'https://edufulness.com',
    'https://www.edufulness.com',
];

/** Per-IP throttle. Deliberately crude — a shared host has no Redis. */
const RATE_LIMIT_SECONDS = 60;
const MAX_FIELD_LENGTH   = 4000;

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

/**
 * Single exit point, so no code path can ever fall through and return 200
 * with an empty body — which the client would read as success.
 */
function respond(bool $ok, string $message, int $code = 200): never
{
    global $wantsJson;
    http_response_code($code);

    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $message]);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $safe  = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $title = $ok ? 'Message sent' : 'Message not sent';
    echo <<<HTML
    <!doctype html><html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>$title — EduFulness</title>
    <style>
      body{background:#0d0714;color:#f4f4f6;font:16px/1.6 system-ui,sans-serif;
           display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}
      div{max-width:38rem;text-align:center}
      a{color:#4b85ff}
    </style></head><body><div>
      <h1>$title</h1><p>$safe</p>
      <p><a href="/dsa/#contact">Back to the course</a></p>
    </div></body></html>
    HTML;
    exit;
}

/* ── Configuration guard ──
   Better to fail loudly at deploy time than to accept messages and drop them. */
if (MAIL_TO === '') {
    respond(false, 'This form is not configured yet.', 500);
}

/* ── Method ── */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Method not allowed.', 405);
}

/* ── Origin ──
   Only checked when the browser sends one. A no-JS form post from the same
   site often omits Origin entirely, and rejecting those would break the
   progressive-enhancement path this endpoint exists to support. */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(false, 'Rejected.', 403);
}

/* ── Honeypot ──
   A real person never sees this field. Answer 200 rather than 403: telling a
   bot precisely why it failed is how it learns to pass. */
if (trim((string) ($_POST['company'] ?? '')) !== '') {
    respond(true, 'Thanks.');
}

/* ── Rate limit ──
   One file per IP hash in the system temp dir. Crude, but it survives without
   a database and costs one stat() per request.
   NOTE: this throttles per server, not per user — a shared NAT gets one slot
   a minute between them. Acceptable for a course contact form; not a security
   control. */
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$file = sys_get_temp_dir() . '/efn-dsa-' . hash('sha256', $ip);
if (is_file($file) && (time() - (int) filemtime($file)) < RATE_LIMIT_SECONDS) {
    respond(false, 'Please wait a moment before sending another message.', 429);
}

/* ── Fields ── */
$name    = trim((string) ($_POST['name'] ?? ''));
$email   = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '') {
    respond(false, 'Please give a name and an email address.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'That email address does not look right.', 422);
}
if (mb_strlen($name) > 200 || mb_strlen($email) > 320 || mb_strlen($message) > MAX_FIELD_LENGTH) {
    respond(false, 'That message is too long.', 422);
}

/**
 * Header injection guard.
 *
 * $email and $name are about to be interpolated into mail headers. A CR or LF
 * in either lets an attacker append "Bcc: ..." and turn this into an open
 * relay. filter_var already rejects newlines inside an email address, but the
 * check is repeated here because it is one line and the failure mode is
 * somebody else's spam sent from your domain.
 */
$hasBreak = static fn (string $s): bool => preg_match('/[\r\n]/', $s) === 1;
if ($hasBreak($email) || $hasBreak($name)) {
    respond(false, 'Rejected.', 400);
}

/* ── Send ── */
$safeName = preg_replace('/["\\\\]/', '', $name);
$subject  = '[DSA] Message from ' . $safeName;

$body = "Name:  {$name}\n"
      . "Email: {$email}\n"
      . 'Sent:  ' . gmdate('Y-m-d H:i:s') . " UTC\n"
      . 'IP:    ' . $ip . "\n\n"
      . ($message !== '' ? $message : '(no message)') . "\n";

$headers = [
    'From: EduFulness DSA <' . MAIL_FROM . '>',
    'Reply-To: ' . $safeName . ' <' . $email . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

/* -f sets the envelope sender, which many shared hosts require before they
   will hand the message to the MTA at all. */
$sent = mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);

if (!$sent) {
    respond(false, 'The message could not be sent. Please try again later.', 502);
}

/* Stamp the rate-limit file only on success, so a rejected attempt does not
   lock someone out for a minute. */
@touch($file);

respond(true, "Thanks — we'll reply by email.");
