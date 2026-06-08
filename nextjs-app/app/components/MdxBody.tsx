import { marked } from "marked";

type MdxBodyProps = {
  source: string;
};

export default function MdxBody({ source }: MdxBodyProps) {
  const html = marked.parse(source, { async: false, gfm: true }) as string;

  return (
    <div
      className="prose prose-gray max-w-none prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline prose-pre:overflow-x-auto prose-pre:rounded-md prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-950 prose-pre:text-gray-50 prose-img:rounded-md prose-img:border prose-img:border-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
