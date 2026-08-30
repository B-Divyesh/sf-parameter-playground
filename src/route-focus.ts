const heading = document.querySelector<HTMLHeadingElement>('h1');
const announcer = document.querySelector<HTMLElement>('#route-announcer');

function focusRouteHeading(): void {
  if (!heading || !announcer) return;
  heading.focus({ preventScroll: true });
  announcer.textContent = '';
  window.requestAnimationFrame(() => {
    announcer.textContent = `${heading.textContent?.trim() ?? 'Page'} loaded.`;
  });
}

focusRouteHeading();
window.addEventListener('pageshow', focusRouteHeading);
window.addEventListener('popstate', focusRouteHeading);
