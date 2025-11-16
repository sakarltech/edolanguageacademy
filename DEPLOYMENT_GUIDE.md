# Edo Language Academy - Deployment & Content Management Guide

## Overview

This guide provides comprehensive instructions for deploying your Edo Language Academy website and managing its content. The platform is built with modern web technologies and includes advanced features for student management, course delivery, and community engagement.

## Deployment Instructions

### Publishing Your Website

Your website is ready to be published and made available to the public. Follow these steps to deploy:

1. **Access the Management Dashboard**
   - Click on the project card in your Manus interface
   - Navigate to the Management UI panel on the right side

2. **Publish the Website**
   - Locate the **Publish** button in the top-right corner of the Management UI
   - Click **Publish** to deploy your website to production
   - Your website will be live at your assigned domain (e.g., `yourname.manus.space`)

3. **Configure Custom Domain (Optional)**
   - Go to **Settings → Domains** in the Management UI
   - Add your custom domain (e.g., `www.edolanguageacademy.com`)
   - Follow the DNS configuration instructions provided
   - Update your domain's DNS records to point to Manus servers

### Stripe Payment Configuration

To accept real payments from students, you need to configure your Stripe account:

1. **Access Stripe Settings**
   - Navigate to **Settings → Payment** in the Management UI
   - You will see options to configure Stripe keys

2. **Get Your Stripe Keys**
   - Log in to your Stripe Dashboard at https://dashboard.stripe.com
   - Go to **Developers → API keys**
   - Copy your **Publishable key** and **Secret key**

3. **Configure Live Mode**
   - In the Manus Management UI, switch from Test mode to Live mode
   - Paste your live Stripe keys
   - Save the configuration

4. **Test the Payment Flow**
   - Before going live, use Stripe's test mode with test card: `4242 4242 4242 4242`
   - Verify that enrollments are created correctly
   - Check that webhook events are received

### Admin Access Setup

As the website owner, you automatically have admin privileges. To grant admin access to other instructors or staff:

1. **Access the Database Panel**
   - Go to **Database** in the Management UI
   - Navigate to the `users` table

2. **Update User Role**
   - Find the user you want to promote
   - Change their `role` field from `user` to `admin`
   - Save the changes

3. **Admin Capabilities**
   - Admins can access the `/admin` dashboard
   - Manage enrollments and student progress
   - Upload course materials
   - Send automated notifications
   - View analytics and reports

## Content Management

### Managing Course Materials

To add learning resources for your students:

1. **Access Admin Dashboard**
   - Log in to your website
   - Navigate to `/admin` (only accessible to admins)
   - Go to the **Materials** tab

2. **Upload New Material**
   - Select the course level (Beginner, Intermediary, or Proficient)
   - Choose the week (1-8)
   - Enter a descriptive title
   - Add an optional description
   - Select the material type (Video, PDF, Worksheet, or Recording)
   - Provide the file URL (upload files to cloud storage first)
   - Click **Upload Material**

3. **Organize Materials**
   - Materials are automatically organized by course level and week
   - Students can access materials from their dashboard
   - You can delete materials that are no longer needed

### Managing Student Enrollments

Track and manage student enrollments through the admin dashboard:

1. **View All Enrollments**
   - Go to `/admin` → **Enrollments** tab
   - See all student enrollments with their status

2. **Update Enrollment Status**
   - Each enrollment has a status dropdown
   - Available statuses:
     - **Pending**: Awaiting payment
     - **Paid**: Payment received
     - **Active**: Currently enrolled and attending
     - **Completed**: Finished the course
     - **Cancelled**: Enrollment cancelled

3. **Student Information**
   - View student name, email, course level, and age group
   - Track payment status and enrollment date

### Tracking Student Progress

Monitor and update student progress:

1. **View Progress**
   - In the admin dashboard, you can see overall completion rates
   - Check individual student progress in the enrollments section

2. **Update Progress Manually**
   - Use the admin API to update student progress
   - Mark weeks as completed
   - Record attendance
   - Update assessment scores

3. **Issue Certificates**
   - When a student completes the course and passes the assessment
   - Generate a certificate (using a certificate generation tool)
   - Upload the certificate to cloud storage
   - Use the admin dashboard to issue the certificate
   - Students can download it from their dashboard

### Using the Discussion Forum

The forum provides a space for students to ask questions and interact:

1. **Monitoring Discussions**
   - Visit `/forum` to see all threads
   - Instructor replies are automatically marked with an "Instructor" badge
   - Pin important threads to keep them at the top

2. **Responding to Questions**
   - Log in as an admin
   - Click on any thread to view details
   - Post replies to answer student questions
   - Your replies will be highlighted as instructor responses

3. **Moderating Content**
   - Admins can delete inappropriate threads or replies
   - Lock threads that are no longer accepting replies
   - Pin announcements or important information

### Sending Automated Notifications

Keep students engaged with automated email notifications:

1. **Access Notifications Panel**
   - Go to `/admin` → **Notifications** tab

2. **Available Notification Types**
   - **Class Reminders**: Send 24 hours before class
   - **Weekly Progress Summaries**: Update students on their progress
   - **Incomplete Week Alerts**: Remind students to catch up
   - **Milestone Congratulations**: Celebrate achievements

3. **Sending Notifications**
   - Click the appropriate button to send notifications
   - Emails are personalized with student names and progress data
   - All notifications are logged for your records

**Note**: Currently, email notifications are sent to your admin account for review. To integrate with a real email service (like SendGrid or Mailgun), you'll need to update the email configuration in the code.

## Updating Website Content

### Changing Logo and Branding

1. **Update Logo**
   - Replace the logo file in `client/public/logo.png`
   - Update the `APP_LOGO` constant in `client/src/const.ts`
   - Update the favicon in **Settings → General** in the Management UI

2. **Update Website Title**
   - Change `VITE_APP_TITLE` in **Settings → General**
   - This updates the page title and navigation

### Modifying Course Information

To update course descriptions, pricing, or curriculum:

1. **Course Pages**
   - Edit the course detail pages in `client/src/pages/`
   - Files: `CourseBeginner.tsx`, `CourseIntermediary.tsx`, `CourseProficient.tsx`

2. **Pricing**
   - Update pricing in `client/src/pages/Pricing.tsx`
   - Also update the product prices in `server/products.ts`
   - Sync with your Stripe product prices

3. **Schedule**
   - Modify class times in `client/src/pages/Schedule.tsx`

### Customizing the Chatbot (Efosa)

The AI chatbot "Efosa" answers student questions based on website content:

1. **Update Knowledge Base**
   - Edit `server/chatbot-knowledge.ts`
   - Add new information about courses, policies, or FAQs
   - The chatbot will automatically use this information

2. **Chatbot Behavior**
   - Questions within scope: Answered immediately
   - Questions outside scope: Forwarded to your email
   - The chatbot asks for visitor's email for follow-up

## Analytics and Monitoring

### Viewing Website Analytics

1. **Access Dashboard Panel**
   - Go to **Dashboard** in the Management UI
   - View UV (Unique Visitors) and PV (Page Views)
   - Track enrollment trends

2. **Admin Analytics**
   - Go to `/admin` → **Analytics** tab
   - View enrollment breakdown by course level
   - Track completion rates and certificate issuance

### Monitoring Enrollments

Keep track of your academy's growth:

- **Total Enrollments**: All-time enrollment count
- **Active Students**: Currently enrolled students
- **Certificates Issued**: Completed courses
- **Average Completion**: Overall course completion rate

## Database Management

### Accessing the Database

1. **Database Panel**
   - Click **Database** in the Management UI
   - Browse all tables (users, enrollments, progress, materials, forum)
   - Perform CRUD operations directly

2. **Connection Information**
   - Find connection details in **Database → Settings** (bottom-left)
   - Enable SSL for secure connections
   - Use with database clients like MySQL Workbench

### Backup and Data Export

- **Download All Files**: Use the **Code** panel to download the entire project
- **Database Backups**: Regularly export data from the Database panel
- **Checkpoints**: Create checkpoints before major changes for easy rollback

## Troubleshooting

### Common Issues

**Students can't log in**
- Ensure OAuth is configured correctly
- Check that the login URL is accessible
- Verify user records exist in the database

**Payments not working**
- Verify Stripe keys are configured correctly
- Check webhook endpoint is receiving events
- Ensure Stripe products match your pricing

**Materials not showing**
- Confirm materials are marked as "published"
- Check that the correct course level and week are set
- Verify file URLs are accessible

**Emails not sending**
- Currently emails are sent to admin for review
- To enable real email sending, integrate with an email service provider
- Update the email configuration in `server/_core/emailNotifications.ts`

### Getting Help

- **Manus Support**: Visit https://help.manus.im for technical support
- **Code Access**: Download your project files from the Code panel
- **Rollback**: Use checkpoints to restore previous versions if needed

## Next Steps

Your Edo Language Academy website is fully functional and ready to accept students. Here are some recommended next steps:

1. **Test Everything**: Go through the entire student journey from enrollment to completion
2. **Add Real Content**: Upload actual course materials for all weeks
3. **Configure Email Service**: Integrate with SendGrid or Mailgun for real email delivery
4. **Promote Your Academy**: Share your website link and start enrolling students
5. **Monitor and Iterate**: Use analytics to understand student behavior and improve the experience

Congratulations on launching your Edo Language Academy! You're now equipped to preserve and share the Edo language with students around the world.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Author**: Manus AI
