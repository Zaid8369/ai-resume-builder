import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  FileEdit,
  Share2,
  CheckCircle2,
  Wand2,
  LayoutTemplate,
  Download,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import React from 'react'

function Home() {
  return (
    <div className='bg-white'>
      <Header navLinks={[
  { label: 'Home', href: '#top' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
]} />

      {/* ---------------- HERO ---------------- */}
      <section id='top' className='relative overflow-hidden bg-gradient-to-b from-ink to-ink-light text-white'>
        {/* subtle glow accents */}
        <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl' />

        <div className='relative max-w-screen-xl mx-auto px-6 lg:px-12 py-20 lg:py-32 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-8 animate-fade-up'>
            <Sparkles className='h-4 w-4 text-primary' />
            Powered by AI — built in seconds
          </div>

          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] animate-fade-up'>
            Build a resume that
            <br className='hidden sm:block' />
            <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              {' '}gets you hired
            </span>
          </h1>

          <p className='mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto animate-fade-up'>
            Answer a few questions and let AI write, format, and polish your resume —
            recruiter-ready, ATS-friendly, and done in minutes.
          </p>

          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up'>
            <Link to='/dashboard'>
              <Button size='lg' className='rounded-full px-8 h-12 text-base font-semibold'>
                Build my resume — it's free
              </Button>
            </Link>
            <Link to='/dashboard'>
              <Button
                size='lg'
                variant='outline'
                className='rounded-full px-8 h-12 text-base font-semibold bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white'
              >
                See how it works
              </Button>
            </Link>
          </div>

          {/* trust bar */}
          <div className='mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-400'>
            <div className='flex items-center gap-2'>
              <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
              4.9/5 average rating
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-primary' />
              No credit card required
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-primary' />
              Export to PDF instantly
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className='border-b bg-white'>
        <div className='max-w-screen-xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {[
            { value: '50K+', label: 'Resumes created' },
            { value: '3 min', label: 'Average build time' },
            { value: '92%', label: 'Passed ATS screening' },
            { value: '4.9★', label: 'User rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className='text-3xl font-extrabold text-ink'>{stat.value}</div>
              <div className='text-sm text-ink-muted mt-1'>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id='how-it-works' className='py-20 lg:py-28 px-6 lg:px-12 bg-slate-50'>
        <div className='max-w-screen-xl mx-auto text-center'>
          <span className='text-primary font-semibold text-sm uppercase tracking-wide'>
            How it works
          </span>
          <h2 className='mt-3 text-3xl md:text-4xl font-extrabold text-ink'>
            Three steps to a finished resume
          </h2>
          <p className='mt-3 text-ink-muted max-w-xl mx-auto'>
            No blank-page anxiety. The AI does the heavy lifting — you just review and refine.
          </p>

          <div className='mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-left'>
            {[
              {
                icon: Wand2,
                title: 'Tell us about the role',
                desc: 'Enter your job title and experience level. Our AI drafts a tailored professional summary and bullet points for you.',
              },
              {
                icon: FileEdit,
                title: 'Edit and personalize',
                desc: 'Fine-tune the AI-generated content, add your education and skills, and pick a theme color that fits your style.',
              },
              {
                icon: Download,
                title: 'Export and apply',
                desc: 'Download a polished, print-ready PDF or share a live link directly with recruiters and hiring managers.',
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className='relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                  <step.icon className='h-6 w-6' />
                </div>
                <div className='absolute top-6 right-6 text-4xl font-extrabold text-slate-100'>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className='mt-5 text-lg font-bold text-ink'>{step.title}</h3>
                <p className='mt-2 text-sm text-ink-muted leading-relaxed'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id='features' className='py-20 lg:py-28 px-6 lg:px-12 bg-white'>
        <div className='max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <span className='text-primary font-semibold text-sm uppercase tracking-wide'>
              Why job seekers choose us
            </span>
            <h2 className='mt-3 text-3xl md:text-4xl font-extrabold text-ink'>
              Everything you need, nothing you don't
            </h2>
            <div className='mt-8 space-y-6'>
              {[
                {
                  icon: Sparkles,
                  title: 'AI-written content',
                  desc: 'Generate professional summaries and experience bullet points tailored to your exact job title.',
                },
                {
                  icon: LayoutTemplate,
                  title: 'Clean, recruiter-approved layout',
                  desc: 'A single, well-tested resume layout that reads clearly to both humans and applicant-tracking systems.',
                },
                {
                  icon: Share2,
                  title: 'Share instantly',
                  desc: 'Get a shareable link to your resume, or export a pixel-perfect PDF whenever you need it.',
                },
              ].map((f) => (
                <div key={f.title} className='flex gap-4'>
                  <div className='flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
                    <f.icon className='h-5 w-5' />
                  </div>
                  <div>
                    <h4 className='font-bold text-ink'>{f.title}</h4>
                    <p className='text-sm text-ink-muted mt-1'>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock resume preview card - realistic placeholder, not lorem ipsum */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-300/20 rounded-3xl blur-2xl' />
            <div className='relative rounded-2xl border border-slate-200 bg-white shadow-2xl p-8'>
              <div className='border-b pb-4 mb-4'>
                <div className='h-4 w-40 bg-ink rounded' />
                <div className='h-3 w-28 bg-primary/60 rounded mt-2' />
              </div>
              <div className='space-y-2 mb-5'>
                <div className='h-2.5 w-full bg-slate-100 rounded' />
                <div className='h-2.5 w-11/12 bg-slate-100 rounded' />
                <div className='h-2.5 w-4/5 bg-slate-100 rounded' />
              </div>
              <div className='h-3 w-32 bg-ink/80 rounded mb-3' />
              {[1, 2].map((i) => (
                <div key={i} className='mb-4'>
                  <div className='h-2.5 w-1/2 bg-slate-200 rounded mb-2' />
                  <div className='h-2 w-full bg-slate-100 rounded mb-1' />
                  <div className='h-2 w-5/6 bg-slate-100 rounded' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className='bg-ink text-white'>
        <div className='max-w-screen-xl mx-auto px-6 lg:px-12 py-20 text-center'>
          <h2 className='text-3xl md:text-4xl font-extrabold'>
            Ready to build your resume?
          </h2>
          <p className='mt-3 text-slate-300 max-w-xl mx-auto'>
            Join thousands of job seekers who landed interviews faster with an AI-built resume.
          </p>
          <Link to='/dashboard'>
            <Button size='lg' className='mt-8 rounded-full px-10 h-12 text-base font-semibold'>
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className='bg-white border-t py-8 px-6 lg:px-12'>
        <div className='max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ink-muted'>
          <span>© {new Date().getFullYear()} AI Resume Builder. All rights reserved.</span>
          <div className='flex gap-6'>
            <a href='#' className='hover:text-ink'>Privacy</a>
            <a href='#' className='hover:text-ink'>Terms</a>
            <a href='#' className='hover:text-ink'>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home