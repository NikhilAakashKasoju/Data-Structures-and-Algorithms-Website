# PHP endpoint — deploy notes

This folder is **not** part of the Next build. Nothing in here is copied into
`out/`, and it must not be.

## Where it goes, and why not in `/dsa/`

The site's deploy step is:

> Delete everything inside `public_html/dsa/`, then upload `out/`.

A PHP file inside that folder would be destroyed on **every single deploy**.
So it lives in a sibling folder the deploy never touches:

```
public_html/
  dsa/            ← wiped and replaced each deploy (the static export)
  dsa-api/
    submit.php    ← uploaded once, by hand
```

## Steps

1. Open `dsa-api/submit.php` and set `MAIL_TO` to the address that should
   receive messages. The endpoint refuses to run until you do — it returns a
   500 rather than silently accepting and discarding messages.
2. Leave `MAIL_FROM` as a mailbox **on edufulness.com**. Do not set it to the
   sender's address: the domain does not authorise Gmail (or anyone else) to
   send on its behalf, so SPF/DKIM fail and the mail is binned. The sender goes
   in `Reply-To:`, which is what makes "Reply" work in your mail client.
3. Upload it to `public_html/dsa-api/submit.php`.
4. Set `formEndpoint` in `lib/contact.ts` to
   `"https://edufulness.com/dsa-api/submit.php"` and rebuild. The Contact
   section swaps from the channel hand-off to the form automatically.

## Test it

```bash
curl -i -X POST https://edufulness.com/dsa-api/submit.php \
  -H 'Accept: application/json' \
  -H 'Origin: https://edufulness.com' \
  --data-urlencode 'name=Test' \
  --data-urlencode 'email=you@example.com' \
  --data-urlencode 'message=hello'
```

Expect `{"ok":true}`. A second call within 60 seconds should return **429** —
that is the rate limiter working.

Then check the no-JS path by disabling JavaScript and submitting the form: the
browser should navigate to a small confirmation page rather than showing
nothing.

## What it does and does not protect against

Handled: method check, origin check when the browser sends one, honeypot
field, per-IP throttle, length caps, email validation, and a CRLF guard so
nobody can inject `Bcc:` headers and relay spam through your domain.

Not handled: a determined attacker with many IPs. The throttle is a file
`stat()` per request, not a security control — a shared host has no Redis.
If it ever gets abused, put Cloudflare Turnstile in front of it rather than
making the PHP cleverer.
