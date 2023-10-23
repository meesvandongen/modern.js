import path from 'path';
import { expect, test } from '@modern-js/e2e/playwright';
import { build, getHrefByEntryName } from '@scripts/shared';

test('babel', async ({ page }) => {
  const builder = await build({
    cwd: __dirname,
    entry: {
      index: path.resolve(__dirname, './src/index.js'),
    },
    runServer: true,
    builderConfig: {
      tools: {
        babel(_, { addPlugins }) {
          addPlugins([require('./plugins/myBabelPlugin')]);
        },
      },
    },
  });

  await page.goto(getHrefByEntryName('index', builder.port));
  expect(await page.evaluate('window.b')).toBe(10);
  expect(await page.evaluate('window.bb')).toBe(10);

  builder.close();
});

test('babel exclude', async ({ page }) => {
  const builder = await build({
    cwd: __dirname,
    entry: {
      index: path.resolve(__dirname, './src/index.js'),
    },
    runServer: true,
    builderConfig: {
      tools: {
        babel(_, { addPlugins, addExcludes }) {
          addPlugins([require('./plugins/myBabelPlugin')]);
          addExcludes(/aa/);
        },
      },
    },
  });

  await page.goto(getHrefByEntryName('index', builder.port));
  expect(await page.evaluate('window.b')).toBe(10);
  expect(await page.evaluate('window.bb')).toBeUndefined();

  builder.close();
});
