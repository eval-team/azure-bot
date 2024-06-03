import axios from "axios";
import { useEffect, useState } from "react";
import "@/app/globals.css";

interface MessageModel {
  role: string;
  content: string;
  name: string;
}

const systemMessage = () => {
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<MessageModel[]>([]);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    const conversationId = localStorage.getItem("conversationId");
    const response = await axios.post("/api/message", {
      token,
      conversationId,
      message: input,
      user: "system",
    });
    // setMsg((prevMessages) => [
    //   ...response.data.activities.map((activity: any) => ({
    //     role: activity.from.id,
    //     content: activity.text,
    //     name: activity.from.id,
    //   })),
    // ]);
  };

  return (
    <div className="m-3">
      <div>
        <textarea
          rows={4}
          name="comment"
          id="comment"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="rounded-full ml-1 mt-2 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default systemMessage;
