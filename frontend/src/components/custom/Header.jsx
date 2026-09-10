import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Menu, X } from 'lucide-react'

function Header({ navLinks }) {
    const { isSignedIn } = useUser();
    const [mobileOpen, setMobileOpen] = useState(false);
    const hasNavLinks = navLinks && navLinks.length > 0;

    return (
        <div className="sticky top-0 z-50 px-5 md:px-10 backdrop-blur-md bg-white/80 border-b shadow-sm">
            <div className="flex justify-between items-center py-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <img src="/logo.svg" className="cursor-pointer" width={36} height={36} />
                    <span className="font-bold text-lg tracking-tight text-ink hidden sm:block">
                        AI Resume Builder
                    </span>
                </Link>

                {hasNavLinks && (
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(function (link) {
                            return (
                                <a key={link.href} href={link.href} className="text-sm font-medium text-ink-muted hover:text-primary transition-colors">
                                    {link.label}
                                </a>
                            );
                        })}
                    </nav>
                )}

                <div className="flex items-center gap-3">
                    {isSignedIn ? (
                        <div className="flex gap-3 items-center">
                            <Link to="/dashboard">
                                <Button variant="outline" className="rounded-full hidden sm:inline-flex">Dashboard</Button>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <Link to="/auth/sign-in">
                            <Button className="rounded-full px-6">Get Started</Button>
                        </Link>
                    )}

                    {hasNavLinks && (
                        <button className="md:hidden p-2 text-ink" onClick={function () { setMobileOpen(!mobileOpen); }} aria-label="Toggle menu">
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </div>

            {hasNavLinks && mobileOpen && (
                <nav className="md:hidden pb-4 flex flex-col gap-3">
                    {navLinks.map(function (link) {
                        return (
                            <a key={link.href} href={link.href} onClick={function () { setMobileOpen(false); }} className="text-sm font-medium text-ink-muted hover:text-primary transition-colors">
                                {link.label}
                            </a>
                        );
                    })}
                </nav>
            )}
        </div>
    )
}

export default Header