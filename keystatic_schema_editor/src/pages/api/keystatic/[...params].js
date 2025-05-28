// src/pages/api/keystatic/[...params].js
import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config.js';

const handler = makeHandler({
  config,
});

export const ALL = handler;
export const prerender = false;