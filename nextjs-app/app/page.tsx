import { Suspense } from "react";
import { type PortableTextBlock } from "next-sanity";

import { AllPosts } from "@/app/components/Posts";
import GetStartedCode from "@/app/components/GetStartedCode";
import PortableText from "@/app/components/PortableText";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: settings } = await sanityFetch({ query: settingsQuery });
  const heroDescription = settings?.heroDescription as PortableTextBlock[] | null | undefined;

  return (
    <>
      <div className="bg-gradient-to-r from-red-200 from-0% via-white via-40%  relative">
        <div className="bg-gradient-to-b from-white w-full h-40 absolute top-0"></div>
        <div className="bg-gradient-to-t from-white w-full h-40 absolute bottom-0"></div>
        <div className="container relative">
          <div className="mx-auto max-w-2xl py-20 lg:max-w-4xl lg:px-12 text-center">
            <div className="flex flex-col gap-4 items-center">
              <div className=" text-md leading-6 prose uppercase">
                {settings?.heroHeading || "Empowering Your Business Through Technology"}
              </div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black">
                <span className="text-red-500 ">
                  Simple
                </span>
                <span className="text-[#000] " >
                  Things
                </span>
              </h1>
            </div>
            <div className="mt-6 space-y-6 prose sm:prose-lg md:prose-xl lg:prose-2xl text-gray-700">
              {heroDescription && heroDescription.length > 0 ? (
                <PortableText value={heroDescription} />
              ) : (
                <p>
                  At Simple Things Limited, we specialise in transforming businesses with cutting-edge consultancy services. Whether you&quot;re scaling your infrastructure, building blockchain solutions, or unlocking the potential of artificial intelligence, our expert team is here to guide you.
                </p>
              )}
            </div>
            <div className="flex items-center flex-col gap-4">
              <GetStartedCode code={settings?.heroAvailability || "Get in touch to discuss your project"} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-10">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>
              <AllPosts />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
