import type { RichMathDisplay } from "../mathEngine";

type MathRichDisplayProps = {
  items?: RichMathDisplay[];
};

type MathAnswerChoiceProps = {
  value: string;
};

const FRACTION_TOKEN_PATTERN = /(\d+\s+\d+\/\d+|\d+\/\d+)/g;
const FRACTION_TOKEN_EXACT_PATTERN = /^(\d+\s+\d+\/\d+|\d+\/\d+)$/;

function InlineFraction({ token }: { token: string }) {
  const mixedMatch = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  const fractionMatch = token.match(/^(\d+)\/(\d+)$/);

  if (mixedMatch) {
    const [, whole, numerator, denominator] = mixedMatch;

    return (
      <span className="math-answer-mixed-fraction" aria-hidden="true">
        <span className="math-answer-whole">{whole}</span>
        <span className="math-answer-fraction">
          <span className="math-answer-fraction-numerator">{numerator}</span>
          <span className="math-answer-fraction-line" />
          <span className="math-answer-fraction-denominator">
            {denominator}
          </span>
        </span>
      </span>
    );
  }

  if (fractionMatch) {
    const [, numerator, denominator] = fractionMatch;

    return (
      <span className="math-answer-fraction" aria-hidden="true">
        <span className="math-answer-fraction-numerator">{numerator}</span>
        <span className="math-answer-fraction-line" />
        <span className="math-answer-fraction-denominator">{denominator}</span>
      </span>
    );
  }

  return <span>{token}</span>;
}

export function MathAnswerChoice({ value }: MathAnswerChoiceProps) {
  const parts = value.split(FRACTION_TOKEN_PATTERN).filter(Boolean);

  if (parts.length <= 1 || !value.includes("/")) {
    return <>{value}</>;
  }

  return (
    <span className="math-answer-rich" aria-label={value}>
      {parts.map((part, index) => {
        if (FRACTION_TOKEN_EXACT_PATTERN.test(part)) {
          return <InlineFraction key={`${part}-${index}`} token={part} />;
        }

        return (
          <span
            className="math-answer-token"
            aria-hidden="true"
            key={`${part}-${index}`}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}

export function MathRichDisplay({ items }: MathRichDisplayProps) {
  if (!items?.length) return null;

  return (
    <div className="math-rich-display" aria-label="Math visual support">
      {items.map((item, index) => {
        if (item.type === "fraction") {
          return (
            <div className="math-fraction-card" key={`${item.type}-${index}`}>
              {item.label && <span className="math-rich-label">{item.label}</span>}
              <span
                className="math-fraction"
                aria-label={
                  item.ariaLabel ??
                  `${item.numerator} over ${item.denominator}`
                }
              >
                <span className="math-fraction-numerator">
                  {item.numerator}
                </span>
                <span className="math-fraction-line" aria-hidden="true" />
                <span className="math-fraction-denominator">
                  {item.denominator}
                </span>
              </span>
            </div>
          );
        }

        return (
          <div className="math-table-card" key={`${item.type}-${index}`}>
            {item.caption && (
              <div className="math-rich-label">{item.caption}</div>
            )}
            <table className="math-data-table">
              <thead>
                <tr>
                  {item.headers.map((header) => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) =>
                      cellIndex === 0 ? (
                        <th key={cellIndex} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={cellIndex}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
