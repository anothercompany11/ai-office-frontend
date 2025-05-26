import "katex/dist/katex.min.css";
import React, { useState } from "react";
import { cn, formatLatex } from "@/app/lib/utils";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isMob?: boolean;
}

interface CodeComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex gap-1 items-center select-none px-4 py-1 text-gray-400 hover:text-gray-200 transition-colors"
      aria-label="Copy"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>복사됨</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>복사</span>
        </>
      )}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  isMob,
}) => {
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 className="font-bold mt-3 mb-2" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p
        className={cn(
          `my-2 text-body-s web:text-body-m leading-relaxed`,
          isMob ? "text-body-s" : "text-body-m",
        )}
        {...props}
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc ml-6 my-2" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal ml-6 my-2" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li
        className={cn(
          `my-1 text-body-s web:text-body-m`,
          isMob ? "text-body-s" : "text-body-m",
        )}
        {...props}
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-3"
        {...props}
      />
    ),
    code: ({
      node,
      inline,
      className,
      children,
      ...props
    }: CodeComponentProps) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";
      const codeContent = String(children).replace(/\n$/, "");

      if (inline) {
        return (
          <code
            className="bg-gray-100 text-pink-500 dark:bg-gray-800 dark:text-pink-400 px-1 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      const isSingleWord =
        !codeContent.includes("\n") &&
        codeContent.trim().split(/\s+/).length === 1;

      if (isSingleWord && codeContent.length < 20) {
        return (
          <code
            className="bg-gray-100 text-pink-500 dark:bg-gray-800 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      return null;
    },
    pre: ({ children, className, ...props }: any) => {
      let language = "";
      let codeContent = "";

      if (children && (children as any).props) {
        const match = /language-(\w+)/.exec(
          (children as any).props.className || "",
        );
        language = match && match[1] ? match[1] : "";
        codeContent = String((children as any).props.children).replace(
          /\n$/,
          "",
        );
      }

      return (
        <div className="my-4 contain-inline-size rounded-md border-[0.5px] border-token-border-medium relative bg-gray-900">
          <div className="flex items-center text-gray-400 px-4 py-2 text-xs font-sans justify-between h-9 bg-gray-800 select-none rounded-t-[5px]">
            {language || "코드"}
          </div>
          <div className="sticky top-9">
            <div className="absolute end-0 bottom-0 flex h-9 items-center pe-2">
              <div className="bg-gray-800 text-gray-400 flex items-center rounded-sm px-2 font-sans text-xs">
                <CopyButton code={codeContent} />
              </div>
            </div>
          </div>
          <div className="overflow-y-auto p-4" dir="ltr">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language || "text"}
              showLineNumbers={false}
              PreTag="div"
              wrapLongLines
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "0.875rem",
              }}
              codeTagProps={{
                className: "whitespace-pre! language-" + language,
              }}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    },
    a: ({ node, ...props }: any) => (
      <a
        className="text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto w-full my-2">
        <table
          className="min-w-full border-collapse border border-gray-300 text-sm"
          {...props}
        />
      </div>
    ),
    thead: ({ node, ...props }: any) => <thead {...props} />,
    tbody: ({ node, ...props }: any) => <tbody {...props} />,
    tr: ({ node, ...props }: any) => <tr {...props} />,
    th: ({ node, ...props }: any) => (
      <th
        className="px-3 py-2 text-left font-medium border border-gray-300 bg-gray-50"
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td className="px-3 py-2 border border-gray-300 katex-cell" {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <strong className="font-bold" {...props} />
    ),
    em: ({ node, ...props }: any) => <em className="italic" {...props} />,
    hr: ({ node, ...props }: any) => (
      <hr className="my-4 border-gray-700" {...props} />
    ),
  };

  return (
    <div className="markdown prose dark:prose-invert w-full break-words dark">
      <style jsx global>{`
        .katex-display {
          display: block;
          margin: 1.5em auto;
          overflow-x: auto;
        }
        .katex {
          font-size: 1em;
          line-height: 1.25;
          vertical-align: middle;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["noopener", "noreferrer"] },
          ],
        ]}
        components={components}
        skipHtml={false}
      >
        {formatLatex(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
