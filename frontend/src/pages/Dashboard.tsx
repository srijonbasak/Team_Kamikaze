import StatCard from '../components/StatCard';

export default function Dashboard() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label="Active Watchers" value="—" footnote="systemd transient units" />
      <StatCard label="fb_ips size" value="—" footnote="IPv4 set elements" />
      <StatCard label="fb6_ips size" value="—" footnote="IPv6 set elements" />
    </div>
  );
}
