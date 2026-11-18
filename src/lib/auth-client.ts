import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';

/**
 * https://www.better-auth.com/docs/installation#create-client-instance
 */
export const authClient = createAuthClient({
  // Browser requests stay on the current origin, including preview domains.
  // During prerendering the browser session is unknown; never fetch it.
  baseURL: typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth`
    : 'http://localhost/api/auth',
  fetchOptions: {
    customFetchImpl: (input, init) => typeof window === 'undefined'
      ? Promise.resolve(Response.json(null))
      : fetch(input, init),
  },
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin#add-the-client-plugin
    adminClient(),
    // https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
    inferAdditionalFields<typeof auth>(),
  ],
});
