type Props = {
  label: string;
  value: string | number;
  footnote?: string;
};

export default function StatCard({ label, value, footnote }: Props) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {footnote ? <div className="text-xs text-gray-400 mt-1">{footnote}</div> : null}
    </div>
  );
}
