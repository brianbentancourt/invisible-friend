'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button, Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import AdBanner from '@/components/AdBanner';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleCTA = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signin');
    }
  };

  const features = [
    {
      title: "Agrega Participantes",
      description: "Añade a tus amigos, familiares o compañeros de trabajo. ¡Tantos como quieras!",
      icon: "👥",
    },
    {
      title: "Establece Exclusiones",
      description: "¿Juan no puede regalarle a María? Configura reglas fácilmente para evitar cruces no deseados.",
      icon: "⚙️",
    },
    {
      title: "Sorteo Automático",
      description: "Nuestro algoritmo se encarga de todo. Nadie sabrá quién le toca a quién hasta que reciban el mensaje.",
      icon: "🎲",
    },
    {
      title: "Notificaciones",
      description: "Envía los resultados mágicamente por Correo Electrónico, WhatsApp o SMS.",
      icon: "📱",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Elementos decorativos de fondo (Gradients) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-6 relative z-10 pt-20 pb-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-10 min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-default-100 border border-default-200 text-sm font-medium tracking-wide text-default-600 mb-6 inline-block">
              ✨ La forma más inteligente de organizar tu sorteo
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Organiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Amigo Invisible</span><br />
              en Segundos
            </h1>
            <p className="text-lg md:text-xl text-default-500 max-w-2xl mx-auto leading-relaxed">
              Olvídate de los papelitos. Agrega a tus amigos, define reglas de exclusión y deja que el sistema les notifique a todos por Email o WhatsApp al instante.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              className="px-10 py-6 text-lg font-semibold"
              isLoading={loading}
              onPress={handleCTA}
            >
              {user ? "Ir a mi Dashboard" : "Comenzar el Sorteo"}
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mt-32">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">¿Cómo funciona?</h2>
            <p className="text-default-500 mt-4 text-lg">Un proceso simple, rápido y 100% libre de trampas.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-none bg-default-50/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardBody className="p-8 text-center flex flex-col items-center">
                    <div className="text-5xl mb-6 bg-default-100 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-default-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ad Banner Section */}
        <div className="mt-20">
          <AdBanner />
        </div>
      </main>
    </div>
  );
}