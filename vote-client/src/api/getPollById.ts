export async function getPollByID(id: string) {
  const response = await fetch(`http://localhost:3000/api/v1/polls/${id}`);
  
    if (!response.ok) {
      throw new Error("Ошибка при получении голосования ");
    }
  
    return await response.json();
  }