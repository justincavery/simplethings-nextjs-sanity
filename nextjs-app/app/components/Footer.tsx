export default function Footer() {
  return (
    <footer className="bg-gray-50 border-gray-100 border-t">
      <div className="container">
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-gray-800/50 text-center text-2xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-2xl">
            Built by <span className="tracking-tight"><span className="text-red-500 ">
                  Simple
                </span>
                <span className="text-[#000] " >
                  Things
                </span></span> with the help of Sanity + Next.js.
          </h3>
          <div className="flex flex-col gap-3 items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
            {/* <a
              href="https://github.com/sanity-io/sanity-template-nextjs-clean"
              className="rounded-full flex gap-2 items-center bg-black hover:bg-red-500 focus:bg-cyan-500 py-3 px-6 text-white transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
            <a href="https://nextjs.org/docs" className="mx-3 hover:underline">
              Read Next.js Documentation
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
