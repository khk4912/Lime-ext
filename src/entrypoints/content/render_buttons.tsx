import { createRoot, type Root } from 'react-dom/client'
import { PlayerButtonRenderer } from '@/components/PlayerButtonRenderer'
export function RenderButtons () {
  let div = document.createElement('div')
  div.id = 'lime-buttons'

  document.body.appendChild(div)

  let root = inject(<PlayerButtonRenderer />, div)

  window.navigation?.addEventListener('navigate', () => {
    root.unmount()
    div.remove()

    div = document.createElement('div')
    div.id = 'lime-buttons'

    document.body.appendChild(div)
    root = inject(<PlayerButtonRenderer />, div)
  })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
