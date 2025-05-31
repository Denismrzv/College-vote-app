// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { fetchPolls } from "../api/polls";
import { useNavigate } from "react-router-dom";

interface Poll {
  id: number;
  title: string;
  created_at: string;
  options: string[];
}

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls()
      .then(setPolls)
      .catch((err) => {
        console.error(err);
        setError("Помилка при завантаженні голосувань");
      });
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Список голосувань</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Назва</th>
            <th className="border px-4 py-2 text-left">Дата створення</th>
            <th className="border px-4 py-2 text-left">Кількість варіантів</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.id}>
              <td
                className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/poll/${poll.id}`)}
              >
                {poll.title}
              </td>
              <td className="border px-4 py-2">
                {new Date(poll.created_at).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{poll.options}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
