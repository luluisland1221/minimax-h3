export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.HTTPS_PROXY) {
    return;
  }

  const { ProxyAgent, setGlobalDispatcher } = await import(
    /* webpackIgnore: true */ 'undici'
  );
  setGlobalDispatcher(new ProxyAgent(process.env.HTTPS_PROXY));
}
