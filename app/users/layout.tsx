export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center gap-4 py-8 md:py-10">
      <div className=" pt-16 px-6 justify-center w-full">{children}</div>
    </section>
  );
}
