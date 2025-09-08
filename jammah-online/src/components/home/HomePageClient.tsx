'use client'

import { motion } from "framer-motion"
import { SignInButton, SignOutButton } from "@/components/auth/buttons"
import { SessionManager } from "@/components/home/SessionManager"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"

export function HomePageClient({ session }) {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <AnimatedBackground />
      <header className="flex justify-between items-center p-4 relative z-10">
        <motion.a
          href="/"
          className="text-2xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          Jammah Online
        </motion.a>
        <div className="flex items-center gap-4">
          <motion.a
            href="/settings"
            className="text-sm text-muted-foreground hover:text-primary"
            whileHover={{ scale: 1.05 }}
          >
            Settings
          </motion.a>
          {session ? <SignOutButton /> : <SignInButton />}
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4 relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Jammah Online
        </motion.h1>
        {session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
              Welcome back, {session.user?.name}!
            </p>
            <SessionManager />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
              Your new favorite place for family fun. Create a session, invite your loved ones, and play exciting games together!
            </p>
            <SignInButton />
          </motion.div>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground relative z-10">
        Developed By Hussain Alkhatib
      </footer>
    </div>
  )
}
