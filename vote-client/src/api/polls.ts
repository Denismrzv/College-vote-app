export async function fetchPolls() {
    const response = await fetch("http://localhost:3000/api/v1/polls");
  
    if (!response.ok) {
      throw new Error("Ошибка при получении голосований");
    }
  
    return await response.json();
  }