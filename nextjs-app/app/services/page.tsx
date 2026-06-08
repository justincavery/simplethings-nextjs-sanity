import Link from "next/link";
import type { Metadata } from "next";

import { services } from "@/lib/services";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Cloud, DevOps, blockchain data, web platform, and technical strategy services from Simple Things.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-shell">
        <div className="max-w-4xl">
          <p className="eyebrow">Services</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-gray-950 sm:text-6xl">
            Consultancy that can reason, build, debug, and leave things easier to run.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            {site.heroDescription}
          </p>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="section-shell grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-md border border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-semibold tracking-normal">{service.title}</h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">{service.summary}</p>
              <ul className="mt-5 grid gap-2 text-sm text-gray-700">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="border-t border-gray-100 pt-2">
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-md border border-gray-200 p-8">
          <p className="eyebrow">Availability</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal">{site.heroAvailability}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
            Useful projects usually start with a short diagnosis: what is expensive, slow, fragile, or unclear, and what has to be true when the work is finished.
          </p>
          <Link
            href="mailto:hello@simplethin.gs"
            className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
