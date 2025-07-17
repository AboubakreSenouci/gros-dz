import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

const WHATSAPP_API = 'https://graph.facebook.com/v22.0/693405723860387/messages';
const getWhatsappPayload = (to: string, message: string) => ({
    'message_product': 'whatsapp',
    'type': 'template',
    to,
    'template': {
        'name': message,
        'language': {
            'code': 'en_US'
        }
    }
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    plugins: [
        phoneNumber({  
            sendOTP: ({ phoneNumber, code }: { phoneNumber: string; code: string}, request: Request) => { 
                const payload = getWhatsappPayload(phoneNumber, code);
                const seriliazedPayload = JSON.stringify(payload);

                fetch(WHATSAPP_API, {
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
        
        // Make sure this is the last plugin in the array
        nextCookies(),
    ]
});