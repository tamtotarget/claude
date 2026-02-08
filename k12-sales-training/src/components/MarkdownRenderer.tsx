import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={content}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-600">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-800">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-light bg-blue-50 px-4 py-3 my-4 rounded-r-lg text-gray-700 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
          em: ({ children }) => (
            <em className="text-gray-500">{children}</em>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}
