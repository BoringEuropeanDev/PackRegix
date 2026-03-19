const admin = require('firebase-admin');
const crypto = require('crypto');
const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

exports.lemonWebhook = onRequest(async (req, res) => {
  const signature = req.get('x-signature');
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  const payload = JSON.stringify(req.body);
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  if (!signature || digest !== signature) {
    res.status(401).send('Invalid signature');
    return;
  }

  const uid = req.body?.meta?.custom_data?.uid;
  const subId = req.body?.data?.id;
  if (uid && subId) {
    await db.collection('users').doc(uid).set({ lemon_sub_id: subId }, { merge: true });
  }

  res.status(200).send('ok');
});

exports.deadlineReminderCron = onSchedule('0 8 * * 1', async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const usersSnap = await db.collection('users').get();
  const sends = usersSnap.docs.map((doc) => transporter.sendMail({
    from: 'alerts@packregix.com',
    to: doc.data().email,
    subject: 'PackRegix Compliance Reminder',
    text: 'Your next EPR reporting deadline is approaching. Log in to PackRegix calendar for details.'
  }));

  await Promise.all(sends);
});
