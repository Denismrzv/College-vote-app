import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePoll() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // минимум 2 пустых поля
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Обновление опции по индексу
  function handleOptionChange(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  // Добавить новое поле для опции
  function addOption() {
    setOptions([...options, ""]);
  }

  // Отправка формы
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Валидация
    if (title.trim() === "") {
      setError("Введите название голосования");
      return;
    }

    // Фильтруем пустые варианты
    const filledOptions = options.filter((opt) => opt.trim() !== "");

    if (filledOptions.length < 2) {
      setError("Введите минимум 2 варианта ответа");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/v1/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, options: filledOptions }),
      });

      if (!response.ok) throw new Error("Ошибка при создании");

      // Редирект на главную или на страницу нового голосования
      navigate(`/`);
    } catch (err: any) {
      setError(err.message || "Ошибка при отправке");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Создать новое голосование</h2>

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
        <button
          type="button"
          onClick={addOption}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Добавить вариант
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Создать
      </button>
    </form>
  );
}
