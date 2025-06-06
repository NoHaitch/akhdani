import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import Heading from "@/components/heading"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "PerdinKu",
    href: "/perdinku",
  },
]

export default function PerdinKu() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="PerdinKu | Akhdani" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Heading title="PerdinKu" description="Perjalanan Dinas Management" />

        {/* Content will be added later */}
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Perjalanan Dinas data will be displayed here</p>
        </div>
      </div>
    </AppLayout>
  )
}
