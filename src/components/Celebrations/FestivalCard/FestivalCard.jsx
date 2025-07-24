import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react"; 

const festivalData = [
  {
    id: 1,
    title: "Happy Diwali!",
    message: "May your Diwali be full of light, joy, and prosperity.",
    date: "12 Nov",
    image:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Happy Holi!",
    message: "Let the colors of Holi spread happiness, peace, and love.",
    date: "8 Mar",
    image:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    title: "Merry Christmas!",
    message: "Wishing you joy, peace, and lots of love this festive season.",
    date: "25 Dec",
    image:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=700&q=80",
  },
];

const FestivalCard = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="w-[300px] bg-white shadow-md rounded-xl cursor-pointer overflow-hidden border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60 }}
    >

      <motion.div layout="position" className="relative">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">
          {card.date}
        </div>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-3">
        <Sparkles className="text-yellow-500" size={20} />
        <h2 className="text-lg font-semibold text-[#113F67]">{card.title}</h2>
      </div>


<AnimatePresence>
  {isOpen && (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-4"
    >
      <p className="text-gray-700 text-sm mb-2">{card.message}</p>
      {/* Remove this duplicate image */}
      {/* <img
        src={card.image}
        alt={card.title}
        className="w-full h-44 object-cover rounded-xl"
      /> */}
    </motion.div>
  )}
</AnimatePresence>

    </motion.div>
  );
};

const Festival = () => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-6 mt-[-30px]">
      {festivalData.map((card) => (
        <FestivalCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default Festival;
