import { useState } from "react";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import Confetti from "@/components/confetti/heart";

// shadcn 사용 시

export default function ConfettiToggle() {
  const [party, setParty] = useState(false);

  return (
    <div className="relative w-full h-screen bg-pink-50 flex flex-col items-center justify-center text-center">
      {party && <Confetti />}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setParty((prev) => !prev)}
        className="z-10 px-6 py-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition"
      >
        {party ? "off" : "하트 팡팡"}
      </motion.button>

      {party && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 mt-10 text-pink-800 text-3xl font-semibold"
        >
          💖
          <div className="z-10 flex justify-center mt-4 space-x-3">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
              >
                <Heart fill="#f43f5e" color="#f43f5e" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
