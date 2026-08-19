import path from 'node:path';
import {
  chromium,
  expect,
  test as base,
  type BrowserContext,
  type Page,
} from '@playwright/test';

const profileRoot = path.resolve(__dirname, '../../playwright');

function getProfileDirectory(): string {
  const configuredDirectory = process.env.PW_PROFILE_DIR?.trim();
  if (configuredDirectory) {
    return path.resolve(configuredDirectory);
  }

  // A persistent Chrome profile cannot be opened by two processes at once.
  // Use one explicit profile by default and allow callers to provide another
  // directory when running independent instances concurrently.
  return path.join(profileRoot, 'chrome-profile');
}

type PersistentFixtures = {
  context: BrowserContext;
  page: Page;
};

export const test = base.extend<PersistentFixtures>({
  context: async ({ }, use) => {
    const profileDirectory = getProfileDirectory();
    const context = await chromium.launchPersistentContext(profileDirectory, {
      channel: 'chromium',
      headless: false,
      locale: 'es-CO',
      timezoneId: 'America/Bogota',
    });

    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
  },
});

export { expect };
