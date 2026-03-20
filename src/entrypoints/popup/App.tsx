import './App.css'
import '@/assets/tailwind.css'

function App () {
  return (
    <>
      <main className='flex h-45 w-[320px]
                     items-center justify-center px-6 text-zinc-50'
      >
        <div className='flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4'>
          <img
            src={browser.runtime.getURL('/icons/128.png')}
            alt='Lime extension logo'
            className='h-14 w-14 shrink-0 object-contain'
          />
          <div className='min-w-0'>
            <h1 className='text-2xl font-semibold tracking-tight text-white'>Lime</h1>
            <p className='mt-1 text-sm text-zinc-400'>씨미 도우미</p>
            <span className='text-xs text-zinc-500'>v{__APP_VERSION__}</span>
          </div>
        </div>
      </main>

      <footer className='container mx-3 p-5'>
        Made with ❤️ by <a href='https://github.com/khk4912' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>kosame</a>
      </footer>
    </>
  )
}

export default App
