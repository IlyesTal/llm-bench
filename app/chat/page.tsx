import Chat from '@/components/chat'

export const runtime = 'edge'

export default function Page() {
  return (
  <div className="flex justify-center py-10">
    <Chat />
  </div>
  )
}
