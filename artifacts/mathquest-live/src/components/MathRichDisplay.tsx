import type { RichMathDisplay } from "../mathEngine";

type MathRichDisplayProps = {
  items?: RichMathDisplay[];
};

type MathAnswerChoiceProps = {
  value: string;
};

type MathInlineTextProps = {
  text: string;
};

const MATH_TOKEN_PATTERN = /(□|\d+\s+\d+\/\d+|\d+\/\d+)/g;
const FRACTION_TOKEN_EXACT_PATTERN = /^(\d+\s+\d+\/\d+|\d+\/\d+)$/;

function normalizeFractionToken(token: string) {
  const mixedMatch = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  const fractionMatch = token.match(/^(\d+)\/(\d+)$/);

  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const numerator = Number(mixedMatch[2]);
    const denominator = Number(mixedMatch[3]);
    if (!Number.isFinite(denominator) || denominator === 0) return null;
    if (numerator === 0) {
      return { whole: String(whole), numerator: null, denominator: null };
    }
    if (numerator % denominator === 0) {
      return {
        whole: String(whole + numerator / denominator),
        numerator: null,
        denominator: null,
      };
    }
    return {
      whole: String(whole),
      numerator: String(numerator),
      denominator: String(denominator),
    };
  }

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);
    if (!Number.isFinite(denominator) || denominator === 0) return null;
    if (numerator % denominator === 0) {
      return {
        whole: String(numerator / denominator),
        numerator: null,
        denominator: null,
      };
    }
    return {
      whole: null,
      numerator: String(numerator),
      denominator: String(denominator),
    };
  }

  return null;
}

function InlineFraction({ token }: { token: string }) {
  const normalized = normalizeFractionToken(token);

  if (!normalized) {
    return <span>{token}</span>;
  }

  if (!normalized.numerator || !normalized.denominator) {
    return <span>{normalized.whole}</span>;
  }

  if (normalized.whole) {
    const { whole, numerator, denominator } = normalized;

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

  const { numerator, denominator } = normalized;

  return (
    <span className="math-answer-fraction" aria-hidden="true">
      <span className="math-answer-fraction-numerator">{numerator}</span>
      <span className="math-answer-fraction-line" />
      <span className="math-answer-fraction-denominator">{denominator}</span>
    </span>
  );
}

export function MathInlineText({ text }: MathInlineTextProps) {
  const parts = text.split(MATH_TOKEN_PATTERN).filter(Boolean);

  if (parts.length <= 1 && !text.includes("/") && !text.includes("□")) {
    return <>{text}</>;
  }

  return (
    <span className="math-answer-rich" aria-label={text}>
      {parts.map((part, index) => {
        if (FRACTION_TOKEN_EXACT_PATTERN.test(part)) {
          return <InlineFraction key={`${part}-${index}`} token={part} />;
        }

        if (part === "□") {
          return (
            <span
              className="math-unknown-box"
              aria-hidden="true"
              key={`${part}-${index}`}
            />
          );
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

export function MathAnswerChoice({ value }: MathAnswerChoiceProps) {
  return <MathInlineText text={value} />;
}

export function MathRichDisplay({ items }: MathRichDisplayProps) {
  if (!items?.length) return null;

  const visibleItems = items.filter(
    (item): item is Extract<RichMathDisplay, { type: "table" }> =>
      item.type === "table",
  );
  if (!visibleItems.length) return null;

  return (
    <div className="math-rich-display" aria-label="Math visual support">
      {visibleItems.map((item, index) => {
        return (
          <div className="math-table-card" key={`${item.type}-${index}`}>
            {item.caption && (
              <div className="math-rich-label">
                <MathInlineText text={item.caption} />
              </div>
            )}
            <table className="math-data-table">
              <thead>
                <tr>
                  {item.headers.map((header) => (
                    <th key={header} scope="col">
                      <MathInlineText text={header} />
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
                          <MathInlineText text={String(cell)} />
                        </th>
                      ) : (
                        <td key={cellIndex}>
                          <MathInlineText text={String(cell)} />
                        </td>
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
