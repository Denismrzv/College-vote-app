import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPollByID} from "../api/getPollById"; // или откуда у тебя функция fetchPollById

interface Poll {
    id: number;
    title: string;
    created_at: string;
    options: string[];
  }

function PollPage() {
    const { id } = useParams(); // Получаем id из URL
    const [selectedOption, setSelectedOption] = useState("");
    const [poll, setPoll] = useState<Poll | null>(null);
    const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    getPollByID(id)
    .then((data) => {
        console.log("Полученный poll:", data);
        // Если options — строка, попробуем распарсить:
        if (typeof data.options === "string") {
          try {
            data.options = JSON.parse(data.options);
          } catch {
            data.options = [];
          }
        }
        setPoll(data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div>Ошибка: {error}</div>;
  if (!poll) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{poll.title}</h1>
      {poll.options.map((option: string, index: number) => (
    <p>
        <label key={index}>
        <input
          type="radio"
          name="poll-option"
          value={option}
          checked={selectedOption === option}
          onChange={() => setSelectedOption(option)}
        />
        {option}
          </label>
    </p>
))}

<button onClick={() => alert("отправлено")}>Отправить</button>
    </div>
  );
}

export default PollPage;