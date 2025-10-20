import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deals/$dynamic')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/deals/$dynamic"!</div>
}
