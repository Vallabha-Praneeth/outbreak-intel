"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlowCard } from "@/components/ui/glow-card"
import { ShieldCheck, Mail, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
            setLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    const handleMagicLink = async () => {
        setLoading(true)
        setMessage(null)
        if (!email) {
            setMessage({ type: 'error', text: "Please enter your email address first." })
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: "Check your email for the magic link!" })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-surface-0 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-intel-cyan/20 blur-[128px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[128px] rounded-full mix-blend-screen" />

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-intel-cyan to-blue-600 mb-6 shadow-xl shadow-intel-cyan/20">
                        <ShieldCheck className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to access secure intelligence.</p>
                </div>

                <GlowCard className="p-8 backdrop-blur-xl bg-surface-1/50">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="name@organization.com"
                                    className="pl-10 bg-surface-0/50 border-border/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="bg-surface-0/50 border-border/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-intel-red/10 text-intel-red' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-intel-cyan hover:bg-intel-cyan/90 text-surface-0 font-bold" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-xs text-muted-foreground font-mono">OR</span>
                        <div className="h-px bg-border flex-1" />
                    </div>

                    <Button
                        variant="outline"
                        className="w-full mt-6 border-border/50 hover:bg-surface-2 gap-2"
                        onClick={handleMagicLink}
                        disabled={loading}
                    >
                        <Mail size={14} /> Send Magic Link
                    </Button>
                </GlowCard>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Identify Provider: Supabase Auth v2
                </p>
            </div>
        </div>
    )
}
