const CronJob = require('cron')
const sgMail = require('@sendgrid/mail')
require('dotenv').config({ path: require('find-config')('.env') })

//cron jalan tiap hari pagi hari
module.exports = function sendEmail(email) {
 new CronJob('59 23 31 12 5 *', function() {
 
   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
   const msg = {
       to: email,
       from: 'webappagung@gmail.com',
       subject: 'Good Day Dear Friend...',
       text: 'I hope you write back',
       html: '<p>Please read or wrire in your account Hacktiv-Overflow for help people in this world</p>',
   }
   sgMail.send(msg)
   console.log('DALAM CRONJOB,, sendgridmail:::::', email, process.env.SENDGRID_API_KEY)
 }, null, true, 'Asia/Jakarta');
}
 