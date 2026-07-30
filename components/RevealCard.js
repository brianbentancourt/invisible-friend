'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@nextui-org/react';

export default function RevealCard({ giverName, receiverName }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ¡Hola, <span className="text-primary">{giverName}</span>!
        </h1>
        <p className="text-lg text-default-500 mb-12 max-w-lg">
          Tu organizador ha hecho el sorteo del Amigo Invisible. ¿Estás listo para descubrir a quién te toca regalar?
        </p>
      </motion.div>

      <div className="relative w-full max-w-md mx-auto aspect-video">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-default-100 rounded-2xl shadow-lg border border-default-200"
            >
              <Button
                color="primary"
                size="lg"
                className="text-xl px-12 py-8 rounded-full font-bold shadow-xl hover:scale-105 transform transition-all"
                onPress={() => setRevealed(true)}
              >
                🎁 Revelar mi amigo
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-2xl border border-primary/30 p-6"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-default-500 mb-2">
                Te toca regalar a...
              </span>
              <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {receiverName}
              </h2>
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🎉</div>
              <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-100">✨</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
