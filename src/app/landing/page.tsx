'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  Code2,
  Play,
  Zap,
  Check,
  ArrowRight,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const router = useRouter();
  const { user, hasAccess } = useAuth();

  const handleGetStarted = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (hasAccess) {
      router.push('/visualizer');
      return;
    }

    // Redirect to payment
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 glass-button-primary rounded-3xl mx-auto mb-4"
          >
            <Code2 className="w-12 h-12" />
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-light via-purple-400 to-secondary-light bg-clip-text text-transparent"
          >
            Algorithm Visualizer
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Transform your code into beautiful, interactive visualizations.
            Learn algorithms like never before with our stunning glassmorphic interface.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {!user && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/auth/login')}
                className="text-lg px-8 py-6"
              >
                Sign In
              </Button>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            <Card hover glass>
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 glass-button-primary rounded-2xl">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Interactive Visualization</h3>
                <p className="text-gray-400">
                  Step through algorithms line by line with beautiful animations
                </p>
              </CardContent>
            </Card>

            <Card hover glass>
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 glass-button-accent rounded-2xl">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Real-time Execution</h3>
                <p className="text-gray-400">
                  Run your code and see the results instantly
                </p>
              </CardContent>
            </Card>

            <Card hover glass>
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 glass-button-secondary rounded-2xl">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Multiple Languages</h3>
                <p className="text-gray-400">
                  Support for JavaScript, Java, C++, and Python
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              Simple, One-Time Payment
            </h2>
            <p className="text-xl text-gray-300">
              Lifetime access to the algorithm visualizer
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-md mx-auto glass-container border-2 border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-center text-3xl">
                  Lifetime Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                    £30
                  </div>
                  <p className="text-gray-400 mt-2">One-time payment</p>
                </div>

                <ul className="space-y-3">
                  {[
                    'Unlimited algorithm visualizations',
                    'Multi-language support',
                    'Step-by-step debugging',
                    'Beautiful glassmorphic UI',
                    'Lifetime updates',
                    'Priority support',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="primary"
                  className="w-full py-6 text-lg"
                  onClick={handleGetStarted}
                >
                  {hasAccess
                    ? 'Go to Visualizer'
                    : user
                    ? 'Complete Payment'
                    : 'Get Started'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment processed by Stripe
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Algorithm Visualizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
