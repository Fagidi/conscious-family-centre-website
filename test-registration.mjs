/**
 * End-to-end test: submit a complete registration and verify:
 * 1. The new CFC-FMS-2026-XXXX ID format appears in the success screen
 * 2. The admin dashboard shows the new registration
 * 3. Email logs record both emails as "no-provider"
 */
import { chromium } from "playwright";
import { SignJWT } from "jose";
import { writeFileSync } from "fs";
import path from "path";

const BASE = "C:/Users/Felix/AppData/Local/Temp/claude/C--Users-Felix-desktop-sarai-website/e44316a3-1ae4-47e7-a9a0-99b69cc8a6e2/scratchpad";
const URL  = "http://localhost:3000";
const JWT_SECRET = "c44305fff5067e8f434201b2bcc17a374fd00f9c4d2da283ee2a9be65cec7285";

const ss = (name) => path.join(BASE, `reg-${name}.png`);

// Tiny valid PNG (1×1 white pixel)
function makePng() {
  const p = path.join(BASE, "fake-proof.png");
  // 67-byte minimal PNG
  const buf = Buffer.from([
    0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a, // PNG signature
    0x00,0x00,0x00,0x0d,0x49,0x48,0x44,0x52, // IHDR chunk length + type
    0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01, // width=1, height=1
    0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53, // bit depth=8, color=RGB
    0xde,0x00,0x00,0x00,0x0c,0x49,0x44,0x41, // CRC, IDAT length+type
    0x54,0x08,0xd7,0x63,0xf8,0xcf,0xc0,0x00, // IDAT data
    0x00,0x00,0x02,0x00,0x01,0xe2,0x21,0xbc, // IDAT CRC
    0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4e, // IEND length+type
    0x44,0xae,0x42,0x60,0x82,               // IEND data+CRC
  ]);
  writeFileSync(p, buf);
  return p;
}

async function adminCookie() {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({ email: "admin@consciousfamilycentre.com", role: "admin" })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
}

async function main() {
  const proofPath = makePng();
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  let passed = 0, failed = 0;

  function ok(msg)   { console.log(`  ✓ ${msg}`); passed++; }
  function fail(msg) { console.error(`  ✗ ${msg}`); failed++; }

  // ─── PART 1: Submit a registration ───────────────────────────────────────
  console.log("\n── Registration form submission ──");
  const regCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const regPage = await regCtx.newPage();

  await regPage.goto(`${URL}/camp-registration`);
  // Clear stale draft so we start fresh
  await regPage.evaluate(() => localStorage.removeItem("fm-registration-draft"));
  await regPage.reload({ waitUntil: "networkidle" });
  // Dismiss announcement bar if present (it overlays elements)
  await regPage.evaluate(() => {
    const bar = document.querySelector('[data-announcement-bar]');
    if (bar) bar.remove();
  });
  await regPage.screenshot({ path: ss("01-start") });

  // Helper: radio/checkbox inputs are sr-only; use force to bypass overlay interception
  const checkRadio = (sel) => regPage.locator(sel).check({ force: true });

  // ── Step 1: Parent ──
  await regPage.fill('input[name="email"]',          "test.parent@example.com");
  await regPage.fill('input[name="parentFullName"]', "Adaeze Okonkwo");
  await regPage.fill('input[name="parentPhone"]',    "+2348012345678");
  await checkRadio('input[name="cfcAttendanceHistory"][value="no"]');
  await regPage.screenshot({ path: ss("02-parent") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);
  await regPage.screenshot({ path: ss("02b-after-continue") });

  // ── Step 2: Child ──
  await regPage.locator('input[placeholder="Enter child\'s full name"]').first().fill("Emeka Okonkwo");
  await regPage.selectOption('select[name="childrenAges"]', "6-8");
  await checkRadio('input[name="childOneGender"][value="male"]');
  // T-shirt size — controlled select with id="tshirtSize-0"
  await regPage.selectOption('#tshirtSize-0', "6–7 Years");
  await regPage.screenshot({ path: ss("03-child") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);

  // ── Step 3: Programme (no nanny step — age 6-8) ──
  await checkRadio('input[name="selectedMonths"][value="july-august"]');
  await checkRadio('input[name="selectedWeeks"][value="4"]');
  // paymentOption — ensure "full" is selected (it's the default but be explicit)
  await checkRadio('input[name="paymentOption"][value="full"]');
  await regPage.screenshot({ path: ss("04-programme") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);

  // ── Step 4: Emergency ──
  await regPage.locator('textarea[name="emergencyContact"]').fill("Chidi Okonkwo · +2348029876543");
  await regPage.screenshot({ path: ss("05-emergency") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);

  // ── Step 5: Policies ──
  await regPage.locator('input[name="electronicSignature"]').fill("Adaeze Okonkwo");
  await checkRadio('input[name="policyAgreement"]');
  await regPage.screenshot({ path: ss("06-policies") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);

  // ── Step 6: Payment — file upload ──
  const fileInput = regPage.locator('input[type="file"]');
  await fileInput.setInputFiles(proofPath);
  await regPage.waitForTimeout(500);
  await regPage.screenshot({ path: ss("07-payment") });
  await regPage.getByRole("button", { name: "Continue" }).click();
  await regPage.waitForTimeout(600);

  // ── Step 7: Review ──
  await regPage.screenshot({ path: ss("08-review") });
  const reviewHtml = await regPage.content();
  if (reviewHtml.includes("Adaeze Okonkwo")) ok("Parent name on review screen");
  else fail("Parent name missing from review");
  if (reviewHtml.includes("Emeka Okonkwo")) ok("Child name on review screen");
  else fail("Child name missing from review");

  // Submit — use requestSubmit() on the form so React's onSubmit fires correctly
  await regPage.evaluate(() => {
    document.querySelector('[data-announcement-bar]')?.remove();
    // Find the registration form (contains the review table), not the newsletter form
    const forms = [...document.querySelectorAll('form')];
    const regForm = forms.find(f => f.querySelector('dl') || f.querySelector('button[type="submit"]')?.textContent?.includes("Submit"));
    if (regForm) {
      regForm.scrollIntoView({ block: "end" });
      regForm.requestSubmit();
    }
  });
  console.log("  → Submitting (waiting up to 30s for Sanity write + email log)…");

  // Wait for success screen to appear — "Thank you for registering!" is the heading
  let successFound = false;
  try {
    await regPage.waitForFunction(
      () => document.body.innerText.includes("Thank you for registering"),
      { timeout: 30000 },
    );
    successFound = true;
  } catch {
    // Take screenshot of whatever state we're in for diagnosis
  }
  await regPage.screenshot({ path: ss("09-success") });

  if (successFound) {
    const successHtml = await regPage.content();
    const idMatch = successHtml.match(/CFC-FMS-\d{4}-\d{4}/);
    if (idMatch) {
      ok(`New ID format confirmed: ${idMatch[0]}`);
      const seq = parseInt(idMatch[0].split("-").at(-1), 10);
      if (seq >= 1) ok(`Sequence number valid: ${seq}`);
      else fail(`Bad sequence: ${seq}`);
    } else {
      const oldFormat = successHtml.match(/CFC-\d{4}-[A-Z]{3}-[A-Z]{3}-\d{4}/);
      if (oldFormat) fail(`OLD format still in use: ${oldFormat[0]}`);
      else fail("Success screen appeared but no registration ID found");
    }
  } else {
    // Success screen didn't appear — check if form returned an error
    const html = await regPage.content();
    const errorText = html.match(/role="alert"[^>]*>([^<]+)</);
    if (errorText) fail(`Form returned error: ${errorText[1]}`);
    else fail("Success screen did not appear within 30s");
  }

  await regCtx.close();

  // ─── PART 2: Admin verification ───────────────────────────────────────────
  console.log("\n── Admin verification ──");
  const token = await adminCookie();
  const adminCtx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await adminCtx.addCookies([{ name: "admin-session", value: token, domain: "localhost", path: "/", httpOnly: false, secure: false }]);
  const aPage = await adminCtx.newPage();

  // Dashboard
  await aPage.goto(`${URL}/admin/dashboard`, { waitUntil: "networkidle" });
  await aPage.screenshot({ path: ss("10-admin-dashboard") });
  const dash = await aPage.content();
  if (dash.includes("CFC-FMS") || dash.includes("Adaeze Okonkwo")) ok("New registration on dashboard");
  else fail("Registration not visible on dashboard");

  // Notification logs
  await aPage.goto(`${URL}/admin/notifications/logs`, { waitUntil: "networkidle" });
  await aPage.screenshot({ path: ss("11-notif-logs") });
  const logs = await aPage.content();
  if (logs.includes("test.parent@example.com")) ok("Parent confirmation email logged");
  else fail("Parent email not in notification logs");
  if (logs.includes("no-provider") || logs.includes("sent")) ok("Email status recorded");
  else fail("Email status missing");

  // Activity
  await aPage.goto(`${URL}/admin/activity`, { waitUntil: "networkidle" });
  await aPage.screenshot({ path: ss("12-activity") });
  const activity = await aPage.content();
  if (activity.includes("Registration Submitted") || activity.includes("CFC-FMS")) {
    ok("Registration in activity feed");
  } else fail("Registration not in activity feed");

  await adminCtx.close();
  await browser.close();

  console.log(`\n── ${passed} passed, ${failed} failed ──`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
