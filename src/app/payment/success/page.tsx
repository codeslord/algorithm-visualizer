'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Optional: Verify payment status with backend
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card glass className="border-2 border-accent/50">
          <CardContent className="p-12 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-24 h-24 mx-auto text-accent" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-light to-accent-dark bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-300">
                Thank you for your purchase
              </p>
            </div>

            <div className="glass-panel p-6 rounded-lg space-y-2">
              <p className="text-gray-300">
                You now have lifetime access to Algorithm Visualizer
              </p>
              <p className="text-sm text-gray-400">
                Start visualizing algorithms with our beautiful glassmorphic interface
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full py-6"
              onClick={() => router.push('/visualizer')}
            >
              Start Visualizing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-gray-500">
              Session ID: {sessionId?.slice(0, 20)}...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-16 h-16" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
