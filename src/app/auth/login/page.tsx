'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, hasAccess } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Signed in successfully!');

      // Check if user has access after login
      setTimeout(() => {
        if (hasAccess) {
          router.push('/visualizer');
        } else {
          router.push('/landing');
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card glass className="border-2 border-white/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center w-16 h-16 glass-button-primary rounded-2xl"
              >
                <Code2 className="w-8 h-8" />
              </motion.div>
            </div>
            <CardTitle className="text-center text-3xl">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-400 mt-2">
              Sign in to access Algorithm Visualizer
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full py-6"
                type="submit"
                isLoading={loading}
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <Link
                href="/landing"
                className="text-sm text-gray-500 hover:text-gray-400 transition-colors block"
              >
                Back to home
              </Link>
            </div>

            <div className="mt-6 p-4 glass-panel rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Admin Test Credentials:</p>
              <p className="text-xs text-gray-300 font-mono">
                Email: codeslord@gmail.com
              </p>
              <p className="text-xs text-gray-300 font-mono">
                Password: Admin@123456
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
