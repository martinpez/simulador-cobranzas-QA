import { test, expect } from '@playwright/test';

test('abre el simulador de cobranza', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveURL(
        /#\/auth\/login\/SimiladorDNC_Lappiz/
    );
});