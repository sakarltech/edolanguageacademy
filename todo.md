# Edo Language Academy - Project TODO

## Core Pages
- [x] Home page with hero section and course overview
- [x] Courses main page with level comparison
- [x] Course detail pages (Beginner, Intermediary, Proficient)
- [x] Pricing page with clear pricing tiers and bundle offer
- [x] Schedule page with class timetable and upcoming cohorts
- [x] About page with mission and instructor information
- [x] FAQ page with common questions
- [x] Contact page with contact form
- [x] Registration page with enrollment form and payment integration

## Design & Styling
- [ ] Implement modern color palette (white, deep reds, warm golds)
- [ ] Set up typography and fonts
- [ ] Create reusable UI components
- [ ] Implement responsive design (mobile-first)
- [ ] Add micro-animations and transitions

## Features
- [ ] Navigation menu (responsive)
- [ ] Course information display
- [ ] Pricing calculator/display
- [ ] Class schedule calendar
- [ ] Contact form functionality
- [ ] Registration form with Stripe payment
- [ ] SEO optimization (meta tags, structured data)

## Content
- [ ] Populate all course content
- [ ] Add pricing information
- [ ] Include class schedule details
- [ ] Add FAQ content
- [ ] Include testimonials (placeholder if needed)
- [ ] Add cultural imagery and branding elements

## Technical
- [ ] Database schema for contact forms and registrations
- [ ] Stripe payment integration
- [ ] Email notifications for registrations
- [ ] Form validation
- [ ] Error handling
- [ ] Performance optimization

## Current Focus
- [x] Build detailed course pages with full content (Beginner, Intermediary, Proficient)

## Next Phase
- [x] Build Pricing, Schedule, About, FAQ, Contact, and Register pages with full content

## New Feature Request
- [x] Implement AI chatbot that answers questions based on website content
- [x] Configure chatbot to send out-of-scope questions to owner's email
- [x] Add chatbot UI component that appears on all pages

## Design Updates
- [x] Rename chatbot to "Efosa"
- [x] Update color scheme: white and warm gold predominant, deep red as accent only

## Payment Integration
- [x] Add Stripe payment feature to the project
- [x] Integrate Stripe checkout in registration page
- [x] Set up payment confirmation and email notifications
- [x] Create enrollment database schema
- [x] Set up Stripe webhook handler
- [x] Create enrollment success page

## Student Dashboard
- [x] Create protected student dashboard with authentication
- [x] Display enrolled courses and current progress
- [x] Add access to class recordings and materials
- [x] Show upcoming classes and schedule
- [x] Display assessment results and certificates
- [x] Add course completion tracking
- [x] Add database schema for course materials and student progress
- [x] Create student router with progress tracking API
- [x] Build dashboard UI with progress overview, materials access, and certificate download

## Admin Panel
- [x] Create admin dashboard with authentication
- [x] Add course materials upload and management
- [x] Implement enrollment management interface
- [x] Add student progress update functionality
- [x] Create certificate generation and issuance system
- [x] Add analytics dashboard for enrollment and completion trends

## Automated Reminders
- [x] Set up email notification system
- [x] Implement class reminder emails (24 hours before)
- [x] Add weekly progress summary emails
- [x] Create incomplete week alert notifications
- [x] Add milestone congratulations emails

## Discussion Forum
- [x] Create forum database schema
- [x] Build forum router with CRUD operations
- [x] Implement forum UI with threads and replies
- [x] Add instructor Q&A functionality (instructor badge on replies)
- [x] Build thread detail page with reply functionality

## Stripe Integration Update
- [x] Update Stripe Price IDs to use customer's actual Stripe products

## Website Refinement Updates
- [x] Add smooth scroll animations (fade-in/slide-up effects)
- [x] Create curriculum data structure with all module-week mappings
- [x] Update Beginner curriculum with module-week mapping
- [x] Update Intermediary curriculum with module-week mapping
- [x] Update Proficient curriculum with module-week mapping
- [ ] Restructure dashboard to show module-based content (notes, videos, workbooks, assessments)
- [ ] Make all teaching content non-downloadable (view-only/stream-only)
- [ ] Implement admin-triggered certificate generation with PDF template
- [ ] Add automatic certificate email delivery to students
- [ ] Remove "Most Popular" tags from pricing page
- [ ] Update schedule with 11 AM GMT and 11 AM CST time slots
- [ ] Add timezone conversions for UK, Nigeria, Europe, North America
- [ ] Implement automatic rolling cohort logic (Dec 6th start, then every 10 weeks)
- [ ] Update FAQs with new class duration, schedule, and access information
- [ ] Remove learner's age field from registration form
- [ ] Add WhatsApp group link automation in enrollment confirmation emails

## Schedule & Cohort System Updates
- [x] Implement dual time slots (11 AM GMT and 11 AM CST)
- [x] Add automatic timezone conversions (UK, Nigeria, Europe, North America)
- [x] Create automatic rolling cohort logic (Dec 6th start, then every 10 weeks)
- [x] Update schedule page with new time slot information
- [x] Clarify that learners only need to attend one time slot
- [x] Remove age-specific class time differences (same for all ages)

## Pricing Page Update
- [x] Remove "Most Popular" badges from all course cards
- [x] Ensure all course levels are presented equally

## FAQ Page Updates
- [x] Update class duration to 60 minutes (remove 60-75 minute references)
- [x] Add information about dual time slot options (11 AM GMT and 11 AM CST)
- [x] Clarify that students only need to attend one time slot
- [x] Update information about module-based curriculum structure
- [x] Clarify that materials are non-downloadable and accessed through dashboard
- [x] Update cohort information (new cohorts every 10 weeks starting Dec 6th)
- [x] Add new FAQ categories for Learning Materials & Access and Community & Support

## Registration Form Updates
- [x] Remove "Learner's Age" field from registration form
- [x] Add "Preferred Time Slot" dropdown (11 AM GMT or 11 AM CST)
- [x] Add optional WhatsApp number field for group link delivery
- [x] Update enrollment database schema to include timeSlot and whatsappNumber
- [x] Update enrollment router to handle new fields
- [x] Update Admin page to display timeSlot instead of ageGroup

## WhatsApp Group Link Management
- [x] Create database schema for storing WhatsApp group links
- [x] Create admin router for managing WhatsApp group links
- [x] Build admin UI for adding/editing WhatsApp group links
- [x] Update enrollment confirmation email to include WhatsApp group link
- [x] Add WhatsApp group link to enrollment success page

## Enhanced Student Dashboard with Module Structure
- [x] Restructure dashboard to display 4 modules instead of 8 weeks
- [x] Update database schema to track module completion (4 modules)
- [x] Implement view-only access for teaching notes (no downloads)
- [x] Implement stream-only access for videos (no downloads)
- [x] Add visual progress tracking with module completion checkboxes
- [x] Update admin interface to upload materials by module instead of week
- [x] Create module-based content tabs in student dashboard
- [x] Add progress percentage indicator based on module completion

## Certificate Generation System
- [x] Create PDF certificate template with Edo branding
- [x] Build certificate generation function with student name, course level, completion date, and assessment scores
- [x] Add admin procedure to trigger certificate generation for eligible students
- [x] Store certificate URLs in database for dashboard access
- [x] Add certificate management tab in admin panel
- [x] Update student dashboard to display certificate download link
- [x] Add certificate issuance tracking
- [ ] Implement automatic email delivery of certificates to students (requires email service integration)

## Enrollment Flow Refactor (New User Requirements)
- [x] Update Dashboard to show course catalog when user has no enrollment
- [x] Add enrollment dialog to collect time slot and contact info before checkout
- [x] Implement dashboard-based enrollment flow (user selects course from dashboard)
- [x] Ensure Register page is simple account creation only (no course selection)
- [x] Update all public page CTAs to point to /register (already done)
- [x] Migrate Stripe integration to use environment variables for Price IDs
- [ ] Update Stripe webhook to create enrollment AFTER payment success (already implemented)
- [ ] Implement one-level-at-a-time enforcement in dashboard (UI message added, backend enforcement needed)
- [ ] Test complete enrollment flow: Register → Login → Dashboard → Select Course → Pay → Unlock
- [ ] Update enrollment success page to redirect to dashboard
- [ ] Add success message in dashboard after enrollment

## SMTP Email Integration (Namecheap)
- [x] Install nodemailer package for email sending
- [x] Add SMTP environment variables to env.ts (host, port, user, password, from address)
- [x] Create email utility service with Nodemailer configuration
- [x] Create email templates for enrollment confirmation
- [x] Update enrollment success flow to send confirmation email
- [x] Create EMAIL_SETUP.md documentation for SMTP configuration
- [ ] Test email sending with Namecheap SMTP credentials (requires user to add credentials)

## Stripe Pricing Error Fix
- [x] Debug "No such pricing" error in Stripe checkout
- [ ] Restart server to load updated environment variables
- [ ] Verify new Price IDs are loaded correctly
- [ ] Test checkout flow with user's Stripe Price IDs

## Deployment Preparation & Updates
- [x] Temporarily hardcode user's Stripe API keys (Option 3 workaround)
- [x] Update email greeting from Ọ̀bọ́khian to Òb'okhian (welcome)
- [x] Update email closing from Ọ̀vbokhan to Urhuese (thank you)
- [x] Fix class frequency in email to "once per week" (attend one of two time slots)
- [x] Add 2-week Christmas/New Year break to schedule
- [x] Adjust cohort end dates to account for break
- [x] Update subsequent cohort start dates after break
- [ ] Test enrollment flow with user's Stripe account
- [ ] Create deployment checkpoint

## Cohort Scheduling Fix
- [x] Add 1-week break between cohorts (cohorts should not start on same day they end)
- [x] Update cohort interval calculation to account for break
- [x] Display all 2026 cohorts on Schedule page
- [x] Verify cohort dates: Cohort 1 ends Feb 14, Cohort 2 starts Feb 21, break week, Cohort 2 starts Feb 28... wait that's wrong
- [x] Verified actual dates: Cohort ends Apr 18, 1-week break, next starts Apr 25 (working correctly)
- [x] Test cohort date calculations - all 5 cohorts for 2026 displayed correctly

## Cohort Scheduling Correction
- [x] Fix cohort interval calculation: cohort ends, 1 week break, new cohort starts (2 weeks after end date)
- [x] Example: Cohort ends Feb 14 → Break week Feb 21 → New cohort starts Feb 28
- [x] Update Upcoming Cohorts section to show ONLY the next upcoming cohort (singular)
- [x] Update All 2026 Cohorts section to show all cohorts starting from Cohort 1
- [x] Verify dates: First cohort ends Feb 14, second cohort starts Feb 28 ✅
- [x] Test Schedule page displays correctly with single upcoming cohort

## Stripe Price ID Fix
- [x] Check current hardcoded Price IDs in env.ts
- [x] Get correct Price IDs from user's Stripe account
- [x] Update hardcoded Price IDs to match user's account
- [x] Force hardcoded values to override old sandbox environment variables
- [x] Restart server to pick up new webhook secret and Price IDs
- [x] Test enrollment flow with correct configuration - Stripe checkout working ✅
- [ ] Verify webhook integration after publishing

## Post-Payment Issues (Requires Publishing)
- [x] Identified issue: Webhooks don't work in development mode
- [ ] Publish website to get permanent URL
- [ ] Update Stripe webhook endpoint to published URL
- [ ] Configure SMTP credentials for email confirmation
- [ ] Test complete payment flow on published site
- [ ] Verify enrollment creation after payment
- [ ] Verify email confirmation is sent
- [ ] Verify dashboard updates after successful payment

## Webhook & Email Configuration (Published Site)
- [x] Website published at https://edolanguage-7zaznnwb.manus.space
- [x] Stripe webhook endpoint updated to published URL
- [x] SMTP credentials added to Management UI
- [x] Webhook secret updated to match new webhook (whsec_eCQgKHSruGpUV0BRhNAPLn1U851tktRr)
- [ ] Restart server to load new webhook secret and SMTP config
- [ ] Test payment flow: payment → webhook → enrollment created → email sent → dashboard updated
- [ ] Debug any remaining issues

## Webhook Debugging
- [x] Check webhook handler code in server/webhooks/stripe.ts - code looks correct
- [x] Verify webhook is receiving events from Stripe - events are being sent but returning 400 errors
- [x] Check Stripe Dashboard webhook logs - all events failing with 400 error
- [x] Identified issue: Webhook secret mismatch causing signature verification to fail
- [ ] Republish website with updated webhook secret (whsec_eCQgKHSruGpUV0BRhNAPLn1U851tktRr)
- [ ] Test payment flow after republishing
- [ ] Verify enrollment creation and email sending work

## Webhook Secret Fix
- [x] Hardcode webhook secret in env.ts (same approach as Stripe API keys)
- [ ] Republish website with hardcoded webhook secret
- [ ] Test payment flow and check Stripe Dashboard for successful webhook delivery
- [ ] Verify enrollment creation and email sending work after webhook succeeds

## Enrollment Success Page Enhancement
- [x] Add purchase summary section with course details
- [x] Display payment confirmation information
- [x] Add prominent "Go to Dashboard" button
- [x] Show next steps and what to expect
- [x] Test user flow from payment to dashboard

## Scrolling Announcement System
- [x] Create announcements table in database schema
- [x] Add database migration for announcements
- [x] Create tRPC router for announcement CRUD operations
- [x] Build admin panel page for managing announcements
- [x] Create announcement form with title, message, and expiration date
- [x] Implement scrolling banner component for homepage
- [x] Add auto-filtering to show only active announcements
- [x] Add admin navigation route to /admin/announcements
- [ ] Test announcement creation, editing, and expiration
- [ ] Add link to announcements management in admin panel

## Content Consistency & Typo Fixes
- [x] Fix time duration on Courses page (60-75 minutes → 60 minutes)
- [x] Fix time duration on Pricing page (all three course levels)
- [x] Update chatbot knowledge base with correct duration and schedule
- [x] Fix enrollment success page age group reference
- [x] Scan all pages for typos and inconsistencies
- [x] Verify all course information is consistent across pages
- [x] Verify pricing consistency (all using £ GBP)
- [x] Verify FAQ page information matches actual implementation

## Edo Greeting Spelling Fix
- [x] Fix homepage Edo greeting from Ób'ókhían to Òb'okhian
- [x] Verify no other instances of incorrect spelling across website
- [x] Confirmed email template already uses correct Òb'okhian spelling

## Logout/Sign Out Feature
- [x] Add logout button to dashboard UI (both enrolled and unenrolled views)
- [x] Implement logout mutation with redirect to login page
- [x] Added LogOut icon from lucide-react
- [x] Integrated with existing useAuth logout function
- [x] Test logout flow (sign out → redirect to login)

## Logo Integration
- [x] Copy EdoLanguageLogo.png to public folder as edo-logo.png
- [x] Add large logo to homepage hero section (192px mobile, 256px desktop)
- [x] Add large logo to About page header (192px mobile, 256px desktop)
- [x] Optimize sizing for desktop and mobile views with responsive classes

## Student Assessment Upload Feature
- [x] Add assessmentSubmissions table to database schema
- [x] Create backend API for uploading assessment files (uploadAssessment, getMyAssessments, getModuleAssessments)
- [x] Add file upload UI to dashboard for each module
- [x] Display uploaded assessments with submission status (submitted, reviewed, graded)
- [x] Add file type validation (PDF, DOC, DOCX, JPG, PNG - max 10MB)
- [x] Store assessment files in S3 with organized folder structure
- [x] Show submission history for each module with file details, dates, and scores
- [x] Add feedback and score display for graded assessments
- [x] Implement drag-and-drop style upload interface

## Assessment Workflow Enhancement
- [x] Enforce assessment submission before module completion
- [x] Update module completion checkbox to check for assessment submission
- [x] Disable checkbox and show helper text when no assessment uploaded
- [x] Build admin assessment review panel at /admin/assessments
- [x] Add assessment grading interface for instructors with score and feedback
- [x] Implement automated email notifications for graded assessments
- [x] Add email template for assessment grading notifications with score and feedback
- [x] Show validation message when trying to complete module without assessment
- [x] Add assessment statistics dashboard (total, pending, reviewed, graded, avg score)
- [x] Add filters for status and course level in admin panel
- [x] Add quick links to assessment review from main admin dashboard

## Dashboard Error Fixes
- [x] Identify Dashboard page errors (React hooks violation - useQuery in map loop)
- [x] Fix errors by moving assessment query outside the loop
- [x] Test Dashboard with enrolled and unenrolled states
- [x] Verified module completion requirement works correctly

## Stripe Webhook Fix for Custom Domain
- [x] Check current webhook endpoint URL configuration
- [x] Update webhook URL to custom domain (www.edolanguageacademy.com)
- [x] Verify production webhook secret is correctly set
- [x] Updated webhook secret to whsec_dsI6krK1ohnpkMhWFVjU2ayk7VsMcPWm
- [x] Restarted server to apply new configuration
- [ ] Test webhook with Stripe dashboard (after publishing)
- [ ] Verify payment flow works end-to-end (after publishing)

## Stripe Live Mode Migration
- [x] Update Stripe secret key from test (sk_test_) to live (sk_live_)
- [x] Update Stripe publishable key from test (pk_test_) to live (pk_live_)
- [x] Update webhook secret to live mode webhook secret (whsec_dsI6krK1ohnpkMhWFVjU2ayk7VsMcPWm)
- [x] Price IDs remain the same (moved from test to live)
- [x] Restarted server to apply live mode configuration
- [ ] Test live webhook endpoint (after publishing)
- [ ] Verify live payment processing works (after publishing)

## Update Live Mode Price IDs
- [x] Get live mode price IDs from Stripe dashboard
- [x] Update Beginner course price ID (price_1RmcT8H2oBnqcEomY7HNW8jJ)
- [x] Update Intermediary course price ID (price_1RmcXiH2oBnqcEomeTVJu1JD)
- [x] Update Proficient course price ID (price_1RmcbUH2oBnqcEomNA9DUsE8)
- [x] Update Bundle price ID (price_1Sa3rbH2oBnqcEomXYVOLFQQ)
- [ ] Test enrollment with live price IDs (after publishing)

## Webhook Endpoint Debugging
- [x] Test webhook endpoint accessibility (found 404 error on live site)
- [x] Added GET handler for webhook endpoint verification
- [x] Added error handling to POST webhook handler
- [x] Improved logging for debugging
- [ ] Publish changes and confirm webhook test passes

## Post-Login Redirect to Dashboard
- [x] Update OAuth callback to redirect to /dashboard instead of /
- [x] Changed redirect from res.redirect(302, "/") to res.redirect(302, "/dashboard")
- [x] Verified server restarts successfully with changes
- [x] Redirect works for both new signups and returning logins

## Dashboard Welcome Message for First-Time Users
- [x] Design welcome message content with platform tutorial
- [x] Create welcome dialog component with shadcn/ui
- [x] Add user preference tracking for welcome message dismissal (localStorage)
- [x] Show welcome dialog only for first-time users
- [x] Include navigation guide (6-step tutorial) and key features overview
- [x] Added Òb'okhian greeting in dialog title
- [x] Included class schedule information (11 AM GMT & 11 AM CST)
- [x] Dialog appears on both enrolled and unenrolled dashboard views

## Homepage Video Walkthrough Tutorial
- [x] Add video tutorial section to homepage (after hero section)
- [x] Create video embed placeholder (YouTube/Vimeo ready with iframe)
- [x] Add chatbot Efosa reference for additional help
- [x] Design responsive video player section with aspect-video
- [x] Include call-to-action after video (Get Started Now & View FAQ)
- [x] Added 4 key points covered cards (enrollment, materials, assessments, support)
- [x] Included alternative video tag code for direct video file hosting

## Update Homepage Video Embed
- [x] Replace placeholder video URL with YouTube video ID UUpb6BTz-GQ
- [x] Test video playback on homepage
- [x] Verify video displays correctly on mobile and desktop
- [x] Video successfully embedded and playing

## Fix Christmas Break Notation on Schedule
- [x] Move Christmas break notation from Cohort 1 of 2026 to December 6th cohort
- [x] Verify dates are correct (Dec 6, 2025 - Feb 14, 2026 with 2-week Christmas break)
- [x] Removed Christmas break note from 2026 Cohort 1 card
- [x] Added Christmas break note to Next Cohort (December 6th) card

## Timezone Auto-Detection Feature
- [x] Create timezone detection utility function (timezoneDetection.ts)
- [x] Detect visitor's browser timezone using Intl API
- [x] Map detected timezone to recommended class time slot (GMT or CST)
- [x] Update Schedule page with auto-highlighting logic using useState and useEffect
- [x] Add visual badge/indicator for "Recommended for You" time slot
- [x] Added ring-2 ring-primary shadow-lg styling for recommended card
- [x] Added checkmark with "Best time for your timezone" message
- [x] Test with different timezones (UK, Nigeria, US, Europe)

## Personalized Dashboard Name Display
- [x] Add student name display at top left corner of dashboard
- [x] Show greeting with student's name ("Welcome, [Name]!" for unenrolled, "Welcome back, [Name]!" for enrolled)
- [x] Ensure name displays for both enrolled and unenrolled students
- [x] Style with appropriate typography and spacing (text-2xl md:text-3xl)
- [x] Added subtitle showing "Your learning dashboard" for unenrolled and course level for enrolled students
- [x] Moved sign out button to top right for better UX

## SEO Optimization
- [x] Add comprehensive meta tags (title, description, keywords) to all pages
- [x] Create sitemap.xml for search engine crawling (9 pages indexed)
- [x] Create robots.txt to guide search engine bots
- [x] Add structured data (JSON-LD) for EducationalOrganization
- [x] Optimize page titles with target keywords (Edo language, learn Edo, Benin language)
- [x] Add Open Graph meta tags for Facebook/social media sharing
- [x] Add Twitter Card meta tags for Twitter sharing
- [x] Optimize image alt texts with keywords (logo with full keyword phrase)
- [x] Add canonical URLs to prevent duplicate content
- [x] Implement schema.org markup for educational content
- [x] Optimized hero section with primary keywords
- [x] Added meta keywords: Edo language, learn Edo, Benin language, Nigerian languages, Bini language

## Homepage Content Update (Edo vs Bini Clarification)
- [x] Remove "& Write Benin Language" from hero section
- [x] Keep "Learn Edo Language Online: Speak, Read, & Write Edo Language" (Edo is the language, Bini are the people)
- [x] Maintain SEO optimization as is

## Class Schedule Restructure (Time-Based by Level)
- [x] Update from cohort-based dual time slots to level-based single time slots:
  - Beginner: 5pm GMT (suitable for all levels)
  - Intermediary: 6pm GMT
  - Proficient: 7pm GMT
- [x] Show timezone conversions for each time (Nigeria WAT, US CST, Europe CET, UK GMT)
- [x] Update Schedule page with new time-based structure
- [x] Update Pricing page to show class times for each level
- [x] Update FAQ with new schedule information
- [x] Update enrollment dialog/flow (remove time slot selection - now determined by course level)
- [x] Update database schema (timeSlot enum expanded to support new values: 5PM_GMT, 6PM_GMT, 7PM_GMT)
- [ ] Update email templates with new schedule structure (to be done when emails are sent)
- [x] Update chatbot knowledge base with new schedule
- [x] Add messaging about pre-recorded videos coming to dashboard
- [x] Update admin panel to reflect new schedule structure (dashboard shows new times)

## Admin Delete Enrollment Feature
- [x] Add deleteEnrollment procedure to admin router
- [x] Add delete button to enrollment list in admin dashboard
- [x] Add confirmation dialog before deletion
- [x] Test delete functionality

## Admin Bulk Delete Enrollments Feature
- [x] Add bulkDeleteEnrollments procedure to admin router
- [x] Add checkboxes to each enrollment card for selection
- [x] Add "Select All" checkbox in header
- [x] Add bulk delete button with count of selected items
- [x] Add confirmation dialog for bulk deletion
- [x] Test bulk delete functionality
