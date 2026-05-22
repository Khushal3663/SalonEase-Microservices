import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const StatusBreakdown = ({ data }) => {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm h-full">
      <h1 className="text-lg font-bold pb-2 text-gray-700">Status Breakdown</h1>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Legend List */}
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex justify-between text-sm border-b pb-1 border-gray-50"
          >
            <span className="text-gray-500">{item.name}</span>
            <span className="font-semibold text-gray-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBreakdown;
