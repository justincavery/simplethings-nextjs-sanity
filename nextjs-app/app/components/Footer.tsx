import Link from "next/link";

import Brand from "@/app/components/Brand";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container grid gap-8 py-16 sm:grid-cols-[1.2fr_0.8fr] sm:py-20">
        <div>
          <div className="text-2xl">
            <Brand />
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">{site.description}</p>
        </div>
        <div className="grid gap-3 text-sm text-gray-600 sm:justify-end sm:text-right">
          <Link href="/services" className="hover:text-red-500">
            Services
          </Link>
          <Link href="/projects" className="hover:text-red-500">
            Projects
          </Link>
          <Link href="/blog" className="hover:text-red-500">
            Blog
          </Link>
          <a href="mailto:hello@simplethin.gs" className="hover:text-red-500">
            hello@simplethin.gs
          </a>
        </div>
      </div>
    </footer>
  );
}
