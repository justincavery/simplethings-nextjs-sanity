import Link from "next/link";

import Brand from "@/app/components/Brand";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 border-b border-gray-100 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
        <Link href="/" aria-label="Simple Things home" className="text-base sm:text-lg">
          <Brand />
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-3 text-xs leading-5 text-gray-700 sm:gap-6 sm:text-base">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-red-500">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
