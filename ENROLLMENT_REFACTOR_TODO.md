# Enrollment Flow Refactor & Stripe Migration - TODO

## Phase 1: Update Public Pages
- [ ] Update Courses page CTAs to point to /register (not payment)
- [ ] Add "Register to Enrol" primary CTA
- [ ] Add "Already have an account? Log in" secondary CTA
- [ ] Remove any direct payment links from public pages
- [ ] Update all "Enroll Now" buttons throughout site to point to /register or /dashboard (if logged in)

## Phase 2: Refactor Registration Page
- [ ] Update /register to account-creation only (no course selection)
- [ ] Remove course level and time slot fields from registration
- [ ] Keep: Name, Email, Password, Phone (optional), Country (optional)
- [ ] Add Google OAuth sign-in option (if supported)
- [ ] On successful registration: auto-login and redirect to dashboard
- [ ] Remove any Stripe payment logic from registration page

## Phase 3: Create/Update Login Page
- [ ] Ensure /login page exists with email + password
- [ ] Add Google OAuth sign-in option
- [ ] Redirect to dashboard after successful login

## Phase 4: Update Dashboard - No Enrollment State
- [ ] Show welcome message for users with no enrollments
- [ ] Display course catalog with all three levels (Beginner, Intermediary, Proficient)
- [ ] Show: Level name, description, price, next cohort date
- [ ] Add "Enrol" button on each course card
- [ ] Clicking "Enrol" triggers Stripe checkout for that level
- [ ] Remove old dashboard logic that assumed pre-enrollment

## Phase 5: Update Dashboard - Enrolled State
- [ ] Show "Active Course" section at top for enrolled users
- [ ] Display: Level name, progress, quick links to modules
- [ ] Implement one-level-at-a-time rule
- [ ] Disable/hide enrol buttons for other levels when one is active
- [ ] Show helper text: "Complete current level to unlock next"
- [ ] Admin can mark course as "completed" to allow next level enrollment

## Phase 6: Migrate Stripe Integration
- [ ] Remove all hard-coded Manus Stripe keys
- [ ] Update backend to read from environment variables:
  - STRIPE_SECRET_KEY
  - STRIPE_PUBLISHABLE_KEY
  - STRIPE_PRICE_BEGINNER
  - STRIPE_PRICE_INTERMEDIARY
  - STRIPE_PRICE_PROFICIENT
- [ ] Update frontend to use VITE_STRIPE_PUBLISHABLE_KEY
- [ ] Ensure Stripe checkout works from dashboard "Enrol" buttons
- [ ] Update webhook handler to work with customer's Stripe account
- [ ] Test with Stripe test mode keys

## Phase 7: Update Enrollment Logic
- [ ] Move enrollment creation to happen AFTER successful payment
- [ ] Webhook confirms payment and creates enrollment record
- [ ] Redirect to dashboard with success message after payment
- [ ] Update enrollment status to "active" instead of "paid"
- [ ] Ensure one-active-level-at-a-time enforcement in database

## Phase 8: Clean Up & Testing
- [ ] Remove old registration page logic (course selection + payment)
- [ ] Update all navigation links to new flow
- [ ] Test complete flow: Register → Login → Dashboard → Enrol → Payment → Dashboard
- [ ] Verify no references to Manus Stripe sandbox
- [ ] Test with Stripe test cards

## Phase 9: Documentation
- [ ] Create STRIPE_SETUP.md with instructions for adding customer's keys
- [ ] Document where to add Stripe Price IDs
- [ ] Document new enrollment flow
- [ ] Create admin guide for marking courses as "completed"
