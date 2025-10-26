import type { Session, SessionRequestOptions } from '@/services/auth';
import { getSession } from '@/services/auth';
import { checkout, polar, portal } from '@polar-sh/better-auth';
import { polarClient } from './polar';

export type AuthSession = Session;
export type GetSessionOptions = SessionRequestOptions;

export const auth = {
  api: {
    getSession: async (options: GetSessionOptions) => getSession(options),
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "82f4cf12-5912-4fe4-a740-815eb1102fd0",
              slug: "Nodebase",
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ]
    })
  ]
};
