import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PollPage from "./pages/PollPage";
import CreatePoll from "./pages/CreatePoll";
import EditPoll from "./pages/EditPoll.tsx";
function App()
{
  return (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/poll/:id" element={<PollPage/>}></Route>
        <Route path="/poll/create" element={<CreatePoll/>}></Route>
        <Route path="/poll/:id/edit" element={<EditPoll/>}></Route>
    </Routes>
  </BrowserRouter>)
}

export default App;