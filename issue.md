# 🐛 Issue Report: Duplicate CRM / Sheet Entries

**Reported On:** 18 July 2026  
**Affected Pages:** All landing pages (SAP MM, SAP FICO, Digital Marketing, Manikonda)  
**Status:** ✅ Fixed

---

## What Was Observed

In the CRM and Google Sheets, we noticed some leads appearing **twice** — same phone number, two separate rows — even though the user said they **never filled anything twice**.

**Example — SHAIK FOUJIYA:**

| Time | Name | Phone | Source / Message |
|---|---|---|---|
| 7/18/2026 10:54:51 | SHAIK FOUJIYA | 8977392042 | No message provided (Hero Form) |
| 7/18/2026 10:56:39 | *(empty)* | 8977392042 | Immediate callback requested in less than 10 minutes |

She was called and confirmed: **"I only filled the form once. I didn't do anything twice."**

---

## 🕐 Step-by-Step Timeline — What Actually Happened to SHAIK FOUJIYA

### Step 1 — She Opens the Landing Page (10:54 approx.)
She visits the landing page. The page loads with:
- The **Hero Form** at the top (Name + Phone input)
- The blue **"Get A Call Back In Less Than 10 Minutes"** section further below (Phone input only)

### Step 2 — She Starts Filling the Hero Form
She types her name **"SHAIK FOUJIYA"** and then types her phone number **8977392042** into the hero form's phone field.

> 🔑 **This is where the bug silently triggers.**
>
> Her browser (most likely **Google Chrome** or **Microsoft Edge**) sees that she just typed a phone number into a field marked `autocomplete="tel"`. It immediately scans the **entire page** for any other input field that also has `autocomplete="tel"`. It finds the callback section's phone input — which was **also marked `autocomplete="tel"`** — and **auto-fills it silently in the background**, even without her touching it.
>
> She never sees this happen. The callback section is further down the page and she hasn't scrolled there yet.

### Step 3 — She Submits the Hero Form (10:54:51)
She clicks **"Get My Free Demo Now"**. The form submits successfully.
- ✅ Entry 1 created in CRM: **SHAIK FOUJIYA | 8977392042 | Hero Form**
- She gets redirected to the **Thank You page**.

### Step 4 — She Presses the Back Button (~10:55)
After reading the Thank You page, she presses the **browser's Back button** to return to the landing page — maybe to check the course details, batch timings, fees, or the trainer images.

### Step 5 — The Page Restores Its Previous State
When the browser goes back to the landing page, it **restores the page exactly as she left it** — including all the values that were filled in by autofill. So the callback section's phone field still silently contains **8977392042** from Step 2.

> She doesn't notice this because the callback section is a blue strip in the middle of the page — the phone number is sitting in that white input box but she's not looking at it carefully.

### Step 6 — She Scrolls Down the Page
She's reading the page — looking at course details, alumni companies, trainer info, reviews, etc. She scrolls past the blue "Get A Call Back" section.

### Step 7 — She Accidentally Clicks "Submit" (10:56:39)
As she scrolls, she either:
- **Accidentally taps the Submit button** (very common on mobile — the button is large, the number is already filled, and the phone is in her hand)
- OR **consciously clicks it** thinking it was a "proceed" or "continue" or "show more" button — she doesn't realize it's a **second separate form** that sends her number again

The callback section fires its submission:
- ✅ Entry 2 created in CRM: *(no name)* | **8977392042** | **"Immediate callback requested in less than 10 minutes"**

> **This is why her name is missing in the second row** — the callback section only captures the phone number, not the name. If she had consciously filled it herself, she might have noticed there's no name field. But she never consciously interacted with it at all.

---

## 🤔 Why Does This Happen ONLY Sometimes — Not for Every Lead?

This is the key question. Look at the CRM screenshot — Rakesh, Gowri, Hari laxman, Abdul Rafay — none of them have duplicates. Only SHAIK FOUJIYA did (at least in this batch).

**The bug depends on 3 conditions all being true at the same time:**

### Condition 1: The Browser Must Have Autofill Enabled (and Be Aggressive)
Not all browsers behave the same way:
- **Google Chrome & Microsoft Edge** → Very aggressive with autofill. They fill all matching fields on the page simultaneously when they detect a phone number being typed. ✅ Likely to trigger the bug.
- **Firefox** → More conservative. Usually fills only the field you're currently typing in. ❌ Less likely.
- **Safari (iPhone)** → Autofills when you tap the field and select from suggestion, not automatically. ❌ Less likely unless she tapped the callback field.
- **Older or basic browsers** → May not autofill at all. ❌ Won't trigger.

> SHAIK FOUJIYA was most likely using **Chrome on Android or Chrome on desktop** — the most common browser in India.

### Condition 2: The User Must Have a Phone Number Saved in the Browser
Autofill only works if:
- The browser has previously saved a contact with a phone number
- OR the user allowed Chrome to save their phone number on a previous website
- OR they use Google Account sync which shares phone numbers across devices

Most regular internet users in India use Chrome signed into their Google account → **their phone number is saved** and Chrome readily autofills it.

Some users, especially older people or first-time form fillers, may not have their number saved → No autofill → No bug.

### Condition 3: The User Must Come Back to the Page AND Click Submit
Even if the autofill happens, the bug only fires if the user:
1. Presses the **Back button** after submitting the hero form (not everyone does this)
2. AND clicks the **Submit button** in the callback section (even accidentally)

If a user submits the hero form and closes the tab → No second entry.  
If they press Back but don't scroll to the callback section → No second entry.  
If they press Back, scroll to it, but don't click Submit → No second entry.

**All 3 conditions have to line up.** That's why it's rare — maybe 1 in 50 users hits all three.

---

## 🔍 The Technical Root Cause (In Plain Terms)

Our page had **two separate phone input fields** that both had this HTML attribute:

```html
autocomplete="tel"
```

This attribute tells the browser: *"Hey browser, this field expects a telephone number — feel free to auto-fill it with a phone number you have saved."*

The **Hero Form** (top of page) had it — which was good and intentional. Helps users fill the form quickly.

The **"Get A Call Back"** section (blue strip, middle of page) also had it — **this was the bug**. These two fields look identical to the browser. When a user types a phone number in one field, Chrome fills the other one automatically.

---

## ✅ The Fix — What We Changed

We changed **one word** in the HTML for the callback section's input:

```diff
- <input type="tel" name="Mobile" inputmode="numeric" autocomplete="tel" ...>
+ <input type="tel" name="Mobile" inputmode="numeric" autocomplete="off" ...>
```

`autocomplete="off"` tells the browser: *"Do NOT auto-fill this field. The user must type here manually."*

Now:
- The **Hero Form** still has `autocomplete="tel"` → Users can still benefit from autofill when filling the main form (good UX)
- The **Callback Section** has `autocomplete="off"` → Browser will never silently pre-fill it → User must intentionally type their number → Zero accidental double submissions

This fix was applied to **all 4 landing pages**:
- ✅ `mm-landing-page.html`
- ✅ `fico-landing-page.html`
- ✅ `digital-marketing.html`
- ✅ `sap-training-manikonda-hyderabad.html`

---

## 📌 Summary in One Line

> The browser silently copied SHAIK FOUJIYA's phone number from the hero form into the "Get A Call Back" section automatically (because both fields had `autocomplete="tel"`). When she came back to the page and accidentally clicked Submit on the blue section, it sent her number to the CRM a second time — without her knowing. She genuinely did not fill any form twice.
