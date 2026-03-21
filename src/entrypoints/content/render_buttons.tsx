import { createRoot, type Root } from 'react-dom/client'
import { PlayerButtonRenderer } from '@/components/PlayerButtonRenderer'
import { OptionProvider } from '@/providers/OptionProvider'

export function RenderButtons () {
  let div = document.createElement('div')
  div.id = 'lime-buttons'

  document.body.appendChild(div)

  let root = inject(
    <OptionProvider>
      <PlayerButtonRenderer />
    </OptionProvider>,
    div
  )

  window.navigation?.addEventListener('navigate', () => {
    root.unmount()
    div.remove()

    div = document.createElement('div')
    div.id = 'lime-buttons'

    document.body.appendChild(div)
    root = inject(
      <OptionProvider>
        <PlayerButtonRenderer />
      </OptionProvider>,
      div
    )
  })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
