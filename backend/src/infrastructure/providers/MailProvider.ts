import nodemailer from 'nodemailer';

export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export class MailProvider {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'placeholder@ethereal.email',
                pass: process.env.SMTP_PASS || 'placeholder_pass',
            },
        });
    }

    async sendMail({ to, subject, html }: SendMailOptions): Promise<void> {
        try {
            const info = await this.transporter.sendMail({
                from: `"NexHire" <${process.env.SMTP_USER || 'noreply@nexhire.com'}>`,
                to,
                subject,
                html,
            });

            console.log(`[MailProvider] Email sent: ${info.messageId}`);
            if (process.env.SMTP_HOST?.includes('ethereal.email')) {
                console.log(`[MailProvider] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        } catch (error) {
            console.error('[MailProvider] Error sending email:', error);
            // We don't throw here to avoid breaking the main flow if email fails
        }
    }
}
