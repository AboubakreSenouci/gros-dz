import { betterAuth } from "better-auth";
import { customSession, phoneNumber } from "better-auth/plugins";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { resend } from "./resend.client";

const getWhatsappPayload = (to: string, message: string) => ({
    'message_product': 'whatsapp',
    'type': 'template',
    "recipient_type": "individual",
    to,
    'template': {
        'name': 'otp',
        'language': {
            'code': 'en_US'
        },
        'components': [{
            'type': 'body',
            'parameters': [
                { type: 'text', text: message }
            ]
        }]
    }
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        debugLogs: true
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // in minutes
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: user.email,
                subject: 'Verify your email address',
                text: `Click the link to verify your email: ${url}`,
            });
        },
    },
    plugins: [
        phoneNumber({
            sendOTP: ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
                const payload = getWhatsappPayload(phoneNumber, code);
                const seriliazedPayload = JSON.stringify(payload);

                fetch(process.env.WHATSAPP_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                    },
                    body: seriliazedPayload,
                });
            },
            signUpOnVerification: {
                getTempEmail: (phoneNumber: string) => {
                    console.log('Phonenumber', phoneNumber);
                    return `${phoneNumber}@my-site.com`;
                },
                getTempName: (phoneNumber: string) => {
                    return phoneNumber;
                }
            },
            otpLength: 6,
        }),

        customSession(async ({ user, session }) => {
            const response = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
                select: {
                    role: true,
                    companyId: true,
                },
            });

            return {
                user: {
                    ...user,
                    role: response?.role,
                    companyId: response?.companyId,

                },
                session,
            }
        }),
        // Make sure this is the last plugin in the array
        nextCookies(),
    ]
});
