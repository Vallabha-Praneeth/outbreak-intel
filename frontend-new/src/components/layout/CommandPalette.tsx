"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Settings,
    Activity,
    Globe,
    Database,
    RefreshCw,
    Link as LinkIcon,
    LayoutDashboard,
    Zap
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="glass border-none">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Jump to Overview</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/events"))}>
                            <Activity className="mr-2 h-4 w-4" />
                            <span>Search Events</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/diseases"))}>
                            <Database className="mr-2 h-4 w-4" />
                            <span>Browse Diseases</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={() => runCommand(() => window.location.reload())}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            <span>Refresh Ingestion Workers</span>
                            <CommandShortcut>⌘R</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigator.clipboard.writeText(window.location.href))}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>Copy Current View Link</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>System Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Intelligence Nodes">
                        <CommandItem>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>South Southeast Asia (IN)</span>
                            <Badge className="ml-2 bg-intel-red/10 text-intel-red border-none">7 SIGNALS</Badge>
                        </CommandItem>
                        <CommandItem>
                            <Zap className="mr-2 h-4 w-4" />
                            <span>WHO Data Lake</span>
                            <Badge className="ml-2 bg-emerald-500/10 text-emerald-500 border-none">ACTIVE</Badge>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
