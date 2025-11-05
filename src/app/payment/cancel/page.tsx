'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card glass className="border-2 border-warning/50">
          <CardContent className="p-12 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <XCircle className="w-24 h-24 mx-auto text-warning" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-warning-light to-warning-dark bg-clip-text text-transparent">
                Payment Cancelled
              </h1>
              <p className="text-lg text-gray-300">
                Your payment was not completed
              </p>
            </div>

            <div className="glass-panel p-6 rounded-lg space-y-2">
              <p className="text-gray-300">
                No charges have been made to your account
              </p>
              <p className="text-sm text-gray-400">
                You can try again anytime to get lifetime access
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 py-6"
                onClick={() => router.push('/landing')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="flex-1 py-6"
                onClick={() => router.push('/landing')}
              >
                Try Again
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
