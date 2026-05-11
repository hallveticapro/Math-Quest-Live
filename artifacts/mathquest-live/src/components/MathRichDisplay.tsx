import type { RichMathDisplay } from "../mathEngine";

type MathRichDisplayProps = {
  items?: RichMathDisplay[];
};

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
