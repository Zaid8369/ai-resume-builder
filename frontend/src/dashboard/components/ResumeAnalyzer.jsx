import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle, FileSearch, RotateCcw, Sparkles } from 'lucide-react'
import { extractTextFromFile } from '@/service/resumeTextExtractor'
import { AIChatSession } from '../../../service/AIModal'
import { toast } from 'sonner'

const ANALYSIS_PROMPT = "You are an expert resume reviewer and ATS specialist with 15 years of recruiting experience. Analyze the resume text below and respond ONLY with valid JSON, no markdown fences, no extra commentary, in exactly this structure: { \"rating\": integer from 1 to 10, \"summary\": \"a 2 to 3 sentence overall assessment\", \"scores\": { \"content\": integer from 1 to 10, \"ats_compatibility\": integer from 1 to 10, \"impact\": integer from 1 to 10, \"formatting\": integer from 1 to 10 }, \"strengths\": [\"strength 1\", \"strength 2\", \"strength 3\"], \"improvements\": [\"specific actionable improvement 1\", \"improvement 2\", \"improvement 3\", \"improvement 4\"] } Resume text: {resumeText}";

function scoreColor(score) {
  if (score >= 8) return '#16a34a';
  if (score >= 5) return '#d97706';
  return '#dc2626';
}

function ScoreRing({ score }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(10, score)) / 10;
  const offset = circumference * (1 - percent);
  const color = scoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink">{score}</span>
        <span className="text-xs text-ink-muted -mt-1">out of 10</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }) {
  const color = scoreColor(score);
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-ink mb-1.5">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: (score * 10) + '%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ResumeAnalyzer() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);

  const reset = () => {
    setResult(null);
    setFileName('');
    setLoading(false);
  }

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setResult(null);

    try {
      const text = await extractTextFromFile(file);
      const trimmedText = text.slice(0, 6000);
      const prompt = ANALYSIS_PROMPT.replace('{resumeText}', trimmedText);
      const response = await AIChatSession.sendMessage(prompt);
      const parsed = JSON.parse(response.response.text());
      setResult(parsed);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to analyze resume. Please try again.');
      setFileName('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
            <div
        className="h-[280px] rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50
        flex flex-col items-center justify-center gap-3
        hover:border-amber-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300
        cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
          <FileSearch className="h-6 w-6 text-amber-600" />
        </div>
        <span className="text-sm font-semibold text-ink">Get AI Feedback</span>
        <span className="text-xs text-ink-muted px-6 text-center">Upload a resume for a rated review</span>
      </div>
      <Dialog open={openDialog} onOpenChange={(open) => { setOpenDialog(open); if (!open) reset(); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Resume Review
            </DialogTitle>
            <DialogDescription>
              Upload a resume and get an instant score with actionable feedback.
            </DialogDescription>
          </DialogHeader>

          {!result && !loading && (
            <label className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <UploadCloud className="h-9 w-9 text-slate-400" />
              <span className="text-sm font-medium text-ink">Click to upload your resume</span>
              <span className="text-xs text-slate-400">PDF, DOCX or TXT — max 5MB</span>
              <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFile} />
            </label>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
              <p className="text-sm text-ink-muted">Analyzing "{fileName}"...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border bg-slate-50 p-5">
                <ScoreRing score={result.rating} />
                <p className="text-sm text-ink-muted leading-relaxed text-center sm:text-left">{result.summary}</p>
              </div>

              {result.scores && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <ScoreBar label="Content Quality" score={result.scores.content} />
                  <ScoreBar label="ATS Compatibility" score={result.scores.ats_compatibility} />
                  <ScoreBar label="Impact & Achievements" score={result.scores.impact} />
                  <ScoreBar label="Formatting" score={result.scores.formatting} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                {result.strengths && result.strengths.length > 0 && (
                  <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
                    <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-ink-muted flex gap-2">
                          <span className="text-green-600 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvements && result.improvements.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <h4 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Suggestions
                    </h4>
                    <ul className="space-y-1.5">
                      {result.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-ink-muted flex gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full gap-2" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Analyze another resume
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ResumeAnalyzer