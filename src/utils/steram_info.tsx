export interface StreamInfo {
  streamerName: string
  title: string
}

export function getStreamInfo (): StreamInfo | null {
  if (!(window.location.pathname.endsWith('/live'))) {
    return null
  }

  const streamerName = document.querySelector('a[class^="user_name"]')?.textContent ?? 'streamer'
  const title = document.querySelector('span[class^="live_title"]')?.textContent ?? 'title'

  return {
    streamerName,
    title
  }
}
