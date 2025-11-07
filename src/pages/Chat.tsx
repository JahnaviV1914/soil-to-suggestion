import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: "bot" | "user";
  text: string;
  image?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `👋 Hi! Please enter soil values for N, P, K, temperature, humidity, pH, and rainfall.
📏 Valid ranges:
N: 0–200 | P: 0–200 | K: 0–200
🌡️ Temperature: -10–60°C | 💧 Humidity: 0–100%
⚗️ pH: 0–14 | ☔ Rainfall: 0–1000mm`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  const navigate = useNavigate();

  // ✅ Fetch Supabase user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate("/auth?mode=login");
      } else {
        const meta = data.user.user_metadata;
        const displayName = meta?.name || meta?.full_name || "User";
        setUserName(displayName);
      }
    };
    fetchUser();
  }, [navigate]);

  // ✅ Logout handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?mode=login");
  };

  // ✅ Valid input ranges
  const ranges = {
    N: [0, 200],
    P: [0, 200],
    K: [0, 200],
    temperature: [-10, 60],
    humidity: [0, 100],
    ph: [0, 14],
    rainfall: [0, 1000],
  };

  const getRangeMessage = (): string => `
📏 Valid ranges:
N: 0–200 | P: 0–200 | K: 0–200
🌡️ Temperature: -10–60°C | 💧 Humidity: 0–100%
⚗️ pH: 0–14 | ☔ Rainfall: 0–1000mm
`;

  // ✅ Extract values
  const extractValues = (text: string): number[] => {
    const nums = text.match(/[-]?[0-9]*\.?[0-9]+/g)?.map(Number) || [];
    return nums.slice(0, 7);
  };

  // ✅ Handle send message
  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const lower = input.toLowerCase();

      // Greeting
      if (lower.includes("hi") || lower.includes("hello")) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `🌱 Hello ${userName}! Please enter soil values for N, P, K, temperature, humidity, pH, and rainfall.\n${getRangeMessage()}`,
          },
        ]);
        return;
      }

      // Range query
      if (lower.includes("range")) {
        setMessages((prev) => [...prev, { sender: "bot", text: getRangeMessage() }]);
        return;
      }

      // Input prediction
      if (lower.match(/\d/)) {
        const [N, P, K, temperature, humidity, ph, rainfall] = extractValues(lower);

        if ([N, P, K, temperature, humidity, ph, rainfall].some((v) => v == null || isNaN(v))) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text:
                "⚠️ Please provide all 7 values — N, P, K, temperature, humidity, pH, rainfall.\nExample: 90 40 45 25 80 6.5 200",
            },
          ]);
          return;
        }

        // Check which values are out of range
        const outOfRange: string[] = [];
        if (N < ranges.N[0] || N > ranges.N[1]) outOfRange.push(`N (${ranges.N[0]}–${ranges.N[1]})`);
        if (P < ranges.P[0] || P > ranges.P[1]) outOfRange.push(`P (${ranges.P[0]}–${ranges.P[1]})`);
        if (K < ranges.K[0] || K > ranges.K[1]) outOfRange.push(`K (${ranges.K[0]}–${ranges.K[1]})`);
        if (temperature < ranges.temperature[0] || temperature > ranges.temperature[1])
          outOfRange.push(`Temperature (${ranges.temperature[0]}–${ranges.temperature[1]}°C)`);
        if (humidity < ranges.humidity[0] || humidity > ranges.humidity[1])
          outOfRange.push(`Humidity (${ranges.humidity[0]}–${ranges.humidity[1]}%)`);
        if (ph < ranges.ph[0] || ph > ranges.ph[1])
          outOfRange.push(`pH (${ranges.ph[0]}–${ranges.ph[1]})`);
        if (rainfall < ranges.rainfall[0] || rainfall > ranges.rainfall[1])
          outOfRange.push(`Rainfall (${ranges.rainfall[0]}–${ranges.rainfall[1]}mm)`);

        if (outOfRange.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `🚫 The following values are out of range:\n${outOfRange.join(", ")}\nPlease re-enter them correctly.`,
            },
          ]);
          return;
        }

        // Valid → confirm
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `🧾 You entered:\nN=${N}, P=${P}, K=${K}, Temp=${temperature}°C, Humidity=${humidity}%, pH=${ph}, Rainfall=${rainfall}mm.\nAnalyzing... 🌱`,
          },
        ]);

        // ✅ Fetch prediction
        setTimeout(async () => {
          const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ N, P, K, temperature, humidity, ph, rainfall }),
          });

          if (!res.ok) throw new Error("Server error");
          const data = await res.json();

          if (data?.recommended_crop) {
            const cropName = data.recommended_crop.toLowerCase();
            const cropImagePng = `/crop_images/${cropName}.png`;
            const cropImageJpg = `/crop_images/${cropName}.jpg`;

            const img = new Image();
            img.src = cropImagePng;
            img.onload = () =>
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: `🌾 I recommend growing **${cropName}** based on your soil values.`,
                  image: cropImagePng,
                },
              ]);
            img.onerror = () =>
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: `🌾 I recommend growing **${cropName}** based on your soil values.`,
                  image: cropImageJpg,
                },
              ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "⚠️ Sorry, I couldn't predict a crop. Please check your values and try again." },
            ]);
          }
        }, 1500);
        return;
      }

      // Fallback
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🤖 Please enter valid soil values for N, P, K, temperature, humidity, pH, rainfall." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Oops! Something went wrong. Please try again." },
      ]);
    }
  };

  // ✅ UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-3xl mb-4">
        <h1 className="text-3xl font-bold text-green-700 flex items-center">🌾 CropBot Assistant</h1>
        <div className="flex items-center gap-4">
          <span className="text-green-700 font-semibold text-lg">Welcome, {userName}! 👋</span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div className="h-[600px] overflow-y-auto border rounded-xl p-4 mb-4 bg-gray-50 whitespace-pre-line">
          {messages.map((msg, i) => (
            <div key={i} className={`my-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-4 py-2 rounded-xl ${
                  msg.sender === "user" ? "bg-green-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.text}</p>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Crop"
                    className="rounded-xl mt-3 w-48 h-36 object-cover border shadow-md transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/crop_images/default.png";
                    }}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your soil values..."
            className="flex-grow p-3 border rounded-l-xl outline-none text-base"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-6 text-base rounded-r-xl hover:bg-green-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
