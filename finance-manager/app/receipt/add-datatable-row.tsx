"use client";

export const AddDatatableRow = ({ table }: any) => {
  const meta = table.options.meta;
  return (
    <div className="footer-buttons">
      <button className="add-button" onClick={meta?.addRow}>
        Add New +
      </button>
    </div>
  );
};
