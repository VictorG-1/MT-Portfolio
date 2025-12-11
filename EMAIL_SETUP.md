# Contact Form Email Setup

The contact form is configured to send emails to **maheethakkar20@gmail.com** via POST method.

## Option 1: PHP (Recommended if you have PHP support)

The `send-email.php` file is already set up and ready to use. Make sure:
1. Your web server has PHP support enabled
2. The `mail()` function is configured on your server
3. The form action points to `send-email.php`

## Option 2: Formspree (For static hosting without PHP)

If you don't have PHP support, you can use Formspree:

1. Go to https://formspree.io and create a free account
2. Create a new form and get your form endpoint (e.g., `https://formspree.io/f/YOUR_FORM_ID`)
3. Update `index.html` line 172 to:
   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Add this hidden input field inside the form:
   ```html
   <input type="hidden" name="_to" value="maheethakkar20@gmail.com">
   ```

## Option 3: EmailJS (Client-side solution)

1. Sign up at https://www.emailjs.com
2. Create an email service and template
3. Update the JavaScript in `script.js` to use EmailJS API

## Current Setup

The form is currently configured to use `send-email.php`. If you're hosting on a server without PHP support, use Option 2 or 3 above.

