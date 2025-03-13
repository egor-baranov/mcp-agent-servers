// src/components/CodeBlock.jsx
import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark'; // Predefined theme

export const CodeBlock = ({ code, language = 'jsx' }) => {
    return (
        <Highlight
            {...defaultProps}
            code={code}
            language={language}
            theme={vsDark}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                    className={`${className} rounded-md p-4 mb-4 overflow-x-auto text-sm`}
                    style={{ ...style, fontFamily: 'Menlo, Monaco, Consolas' }}
                >
          {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                  {/* Line numbers */}
                  <span className="inline-block w-8 opacity-30 select-none mr-4">
                {i + 1}
              </span>
                  {/* Code tokens */}
                  {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                  ))}
              </div>
          ))}
        </pre>
            )}
        </Highlight>
    );
};