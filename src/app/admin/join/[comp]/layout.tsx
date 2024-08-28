export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className='min-h-[calc(100vh-10rem)]  mt-8 flex w-full h-full flex-col items-center gap-8'>
            {children}
        </section>
    )
}
