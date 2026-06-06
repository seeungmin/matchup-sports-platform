#!/usr/bin/env node

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3013';
const runId = process.env.RUN_ID ?? new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join('output', 'playwright', 'v1-responsive-smoke', runId);

const viewports = [
  { key: 'w320', width: 320, height: 812 },
  { key: 'w390', width: 390, height: 844 },
  { key: 'w430', width: 430, height: 932 },
];

const routes = [
  '/search',
  '/search/new',
  '/chat',
  '/chat/room-1',
  '/notifications',
  '/notices',
  '/matches/match-1',
  '/team-matches/team-match-1',
  '/teams/team-1',
  '/my/reviews',
  '/my/reviews?tab=written',
  '/my/reviews?tab=received',
  '/my/reviews/received',
  '/my/reviews/match/match-3',
  '/my/reviews/team_match/team-match-1',
  '/my/reviews/match/match-3?complete=1',
  '/matches/new/sport',
  '/matches/new',
  '/matches/new/place-time',
  '/matches/new/confirm',
  '/team-matches/new/team',
  '/team-matches/new/info',
  '/team-matches/new/condition',
  '/team-matches/new/place-time',
  '/team-matches/new/confirm',
  '/teams/new',
  '/matches/filter',
  '/team-matches/filter',
  '/teams/filter',
];

function slug(route) {
  return route.replace(/^\//, '').replace(/[/?=&:]+/g, '__') || 'root';
}

function routeUrl(route) {
  const base = new URL(baseUrl);
  const basePath = base.pathname.replace(/\/$/, '');
  const [rawRoutePath, rawSearch = ''] = route.split('?');
  const routePath = rawRoutePath.startsWith('/') ? rawRoutePath : `/${rawRoutePath}`;
  base.pathname = `${basePath}${routePath}`.replace(/\/{2,}/g, '/');
  base.search = rawSearch ? `?${rawSearch}` : '';
  return base.toString();
}

async function waitForStablePage(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(450);
}

async function auditRoute(page, route, viewport) {
  const url = routeUrl(route);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForStablePage(page);

  const screenshot = path.join(viewport.key, `${slug(route)}.png`);
  await mkdir(path.join(outDir, viewport.key), { recursive: true });
  await page.screenshot({ path: path.join(outDir, screenshot), fullPage: false });

  const checks = await page.evaluate(() => {
    const frame = document.querySelector('.tm-app-frame') ?? document.querySelector('[style*="100dvh"]');
    const root = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
    const viewportWidth = window.innerWidth;
    const horizontalOverflow = scrollWidth > viewportWidth + 1;

    const appFrame = frame instanceof HTMLElement ? frame.getBoundingClientRect() : null;
    const fixedElements = [...document.querySelectorAll('.tm-fixed-cta, .tm-chat-inputbar, .tm-notification-toast, .tm-bottom-nav')]
      .filter((element) => element instanceof HTMLElement)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          className: element.className.toString(),
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        };
      });

    const fixedOverflow = fixedElements.filter((rect) => rect.left < -1 || rect.right > viewportWidth + 1);
    const textOverflow = [...document.querySelectorAll('button, a, .tm-chip, .tm-badge, .tm-text-heading, .tm-text-subhead, .tm-text-body-lg, .tm-text-label')]
      .filter((element) => element instanceof HTMLElement)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
          className: element.className.toString(),
          width: rect.width,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        };
      })
      .filter((item) => item.clientWidth > 0 && item.scrollWidth > item.clientWidth + 2)
      .slice(0, 10);

    return {
      viewportWidth,
      scrollWidth,
      horizontalOverflow,
      appFrame,
      fixedElements,
      fixedOverflow,
      textOverflow,
    };
  });

  const status = response?.status() ?? 0;
  const issues = [];
  if (status < 200 || status >= 400) issues.push(`HTTP ${status}`);
  if (checks.horizontalOverflow) issues.push(`horizontal overflow ${checks.scrollWidth}>${checks.viewportWidth}`);
  if (checks.fixedOverflow.length > 0) issues.push(`fixed element overflow ${checks.fixedOverflow.length}`);
  if (checks.textOverflow.length > 0) issues.push(`possible text overflow ${checks.textOverflow.length}`);

  return { route, viewport: viewport.key, status, screenshot, issues, checks };
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      const result = await auditRoute(page, route, viewport);
      results.push(result);
      console.log(`${viewport.key} ${route} ${result.issues.length ? `FAIL ${result.issues.join(', ')}` : 'OK'}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ route, viewport: viewport.key, status: 0, screenshot: null, issues: [message], checks: null });
      console.log(`${viewport.key} ${route} FAIL ${message}`);
    }
  }

  await context.close();
}

await browser.close();

const issueCount = results.reduce((count, result) => count + result.issues.length, 0);
const markdown = [
  '# V1 Responsive Route Smoke',
  '',
  `- Base URL: ${baseUrl}`,
  `- Run ID: ${runId}`,
  `- Viewports: ${viewports.map((item) => `${item.key} ${item.width}x${item.height}`).join(', ')}`,
  `- Routes: ${routes.length}`,
  `- Issues: ${issueCount}`,
  '',
  '| Viewport | Route | Status | Screenshot | Issues |',
  '|---|---|---:|---|---|',
  ...results.map((result) => `| ${result.viewport} | \`${result.route}\` | ${result.status} | ${result.screenshot ? `\`${result.screenshot}\`` : ''} | ${result.issues.length ? result.issues.join('<br>') : 'OK'} |`),
  '',
].join('\n');

await writeFile(path.join(outDir, 'results.json'), JSON.stringify({ baseUrl, runId, viewports, routes, issueCount, results }, null, 2));
await writeFile(path.join(outDir, 'report.md'), markdown);

console.log(`report=${path.join(outDir, 'report.md')}`);
if (issueCount > 0) {
  process.exitCode = 1;
}
