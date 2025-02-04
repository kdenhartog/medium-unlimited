import config from './config';
import {setUserId, getUserId} from './storage';
import {track} from './analytics';
import {MEMBERSHIP_PROMPT_CLASSNAME} from './constants';

export function log(...messages) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  console.log(...messages);
}

export function amplitudeApiKey() {
  if (process.env.NODE_ENV === 'production') {
    return config.amplitude.api_key;
  }
  return 'test_api_key';
}

export function init() {
  chrome.runtime.setUninstallURL('example.com');
  chrome.runtime.onInstalled.addListener(() => {
    if (!getUserId()) {
      setUserId(new Date().getTime().toString());
      track('INSTALLED');
    }
  });
}

export function urlWithoutQueryParams(url) {
  if (!url) {
    return '';
  }
  return url.split('?')[0];
}

function hasMembershipPromptNew(document) {
  const article = document.getElementsByTagName('article')[0];
  if (!article) {
    return false;
  }
  const computedStyles = (document.defaultView || window).getComputedStyle(article.nextSibling);
  if (!computedStyles.background) {
    return false;
  }
  return computedStyles.background.indexOf('linear-gradient') > -1;
}

export function hasMembershipPrompt(document) {
  return (
    document.getElementsByClassName(MEMBERSHIP_PROMPT_CLASSNAME).length > 0 ||
    hasMembershipPromptNew(document)
  );
}

export function getTwitterReferer() {
  return `https://t.co/${Math.random().toString(36).slice(2)}`;
}
