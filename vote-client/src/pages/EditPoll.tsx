import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Option {
  id: number;
  text: string;
}

interface Poll {
  id: number;
  title: string;
  options: Option[];
}

export default function EditPollPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
  
    fetch(`http://localhost:3000/api/v1/polls/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки опроса");
        return res.json();
      })
      .then((data: Poll) => {
        // Здесь исправляем options, если они в строке
        const optionsArray = typeof data.options === "string" ? JSON.parse(data.options) : data.options;
  
        setPoll(data);
        setTitle(data.title);
        setOptions(optionsArray.map((o: any) => (typeof o === "string" ? o : o.text)));
      })
      .catch((err) => setError(err.message));
  }, [id]);
  

  function handleOptionChange(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (title.trim() === "") {
      setError("Введите название голосования");
      return;
    }
    if (filledOptions.length < 2) {
      setError("Введите минимум 2 варианта ответа");
      return;
    }

    fetch(`http://localhost:3000/api/v1/polls/${id}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, options: filledOptions }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при сохранении опроса");
        return res.json();
      })
      .then(() => {
        navigate(`/poll/${id}`);
      })
      .catch((err) => setError(err.message));
  }

  if (error) return <div className="text-red-600">Ошибка: {error}</div>;
  if (!poll) return <div>Загрузка...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Редактировать голосование</h2>

      <label className="block mb-2">
        Название:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mt-1"
        />
      </label>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Варианты ответа:</label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Вариант ${index + 1}`}
            className="border p-2 w-full mb-2"
          />
        ))}
        <button type="button" onClick={addOption} className="bg-blue-500 text-white px-3 py-1 rounded">
          Добавить вариант
        </button>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Сохранить
      </button>
    </form>
  );
}
