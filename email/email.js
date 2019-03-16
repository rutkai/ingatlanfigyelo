const config = require('config');
const nodemailer = require('nodemailer');
const Twig = require('twig');

let transporter;


exports.sendEmail = sendEmail;
async function sendEmail(template, recipient, subject, params) {
    const transporter = getTransporter();
    const options = Object.assign({}, config.get('email.options'), {
        to: recipient,
        subject,
        html: await renderTemplate(template, params)
    });

    return transporter.sendMail(options);
}


function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport(config.get('email.transport'));
    }
    return transporter;
}

function renderTemplate(template, params) {
    const additionalParams = {
        baseUrl: config.get('application.baseUrl')
    };
    return new Promise((resolve, reject) => {
        Twig.renderFile(`${__dirname}/views/${template}.html.twig`, Object.assign({}, additionalParams, params), (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}
