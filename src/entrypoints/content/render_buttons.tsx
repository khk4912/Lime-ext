import { createRoot, type Root } from 'react-dom/client'
import { PlayerButtonRenderer } from '@/components/PlayerButtonRenderer'
import { OptionProvider } from '@/providers/OptionProvider'
import { waitForElement } from '@/hooks/element'

const PLAYER_BUTTON_TARGET_SELECTOR = '.vjs-control.vjs-button.vjs-video-edit-open'

export function RenderButtons () {
  let div: HTMLDivElement | null = null
  let root: Root | null = null
  let frameId: number | null = null
  let lastPortalTarget: Element | null = null

  const cleanup = () => {
    root?.unmount()
    root = null

    div?.remove()
    div = null
  }

  const mount = () => {
    cleanup()

    if (document.body === null) {
      return
    }

    div = document.createElement('div')
    div.id = 'lime-buttons'
    document.body.appendChild(div)

    root = inject(
      <OptionProvider>
        <PlayerButtonRenderer />
      </OptionProvider>,
      div
    )
  }

  const remountIfPortalTargetChanged = (aside: Element) => {
    const nextPortalTarget = aside.querySelector(PLAYER_BUTTON_TARGET_SELECTOR)
    if (nextPortalTarget === lastPortalTarget) {
      return
    }

    lastPortalTarget = nextPortalTarget
    mount()
  }

  const scheduleRemountIfNeeded = (aside: Element) => {
    if (frameId !== null) {
      return
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = null
      remountIfPortalTargetChanged(aside)
    })
  }

  mount()

  void waitForElement('#aside').then((aside) => {
    lastPortalTarget = aside.querySelector(PLAYER_BUTTON_TARGET_SELECTOR)

    const observer = new MutationObserver(() => {
      scheduleRemountIfNeeded(aside)
    })

    observer.observe(aside, {
      childList: true,
      subtree: true,
    })
  })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
