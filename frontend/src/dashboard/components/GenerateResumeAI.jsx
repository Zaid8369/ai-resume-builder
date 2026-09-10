import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import GlobalApi from './../../../service/GlobalApi'
import { AIChatSession } from '../../../service/AIModal'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const GENERATE_RESUME_PROMPT = "You are an expert resume writer. Based on the description below, create a complete, realistic, professional resume. Respond ONLY with valid JSON (no markdown fences, no commentary) in exactly this structure: { \"jobTitle\": \"a professional job title based on the description\", \"summery\": \"a compelling 3 to 4 sentence professional summary, no pronouns\", \"themeColor\": \"a professional hex color code such as #4F46E5\", \"experience\": [ { \"title\": \"job title\", \"companyName\": \"a realistic but generic company name\", \"city\": \"city\", \"state\": \"state abbreviation\", \"startDate\": \"Mon YYYY\", \"endDate\": \"Mon YYYY or empty string if current\", \"currentlyWorking\": true only for the most recent role otherwise false, \"workSummery\": \"3 to 4 bullet points separated by newline characters, each starting with a bullet, focused on achievements with metrics where reasonable\" } ], \"education\": [ { \"universityName\": \"realistic university name\", \"degree\": \"degree such as Bachelor of Science\", \"major\": \"field of study\", \"startDate\": \"Mon YYYY\", \"endDate\": \"Mon YYYY\", \"description\": \"1 to 2 sentence description of relevant coursework or achievements\" } ], \"skills\": [ { \"name\": \"skill name\", \"rating\": integer from 3 to 5 } ] } Include 2 experience entries, 1 education entry, and 6 to 8 relevant skills unless the description clearly implies otherwise, for example a student with no work experience should get 0 or 1 experience entries. User's description: {userPrompt}";

function GenerateResumeAI() {
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const onGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const prompt = GENERATE_RESUME_PROMPT.replace('{userPrompt}', description);
      const result = await AIChatSession.sendMessage(prompt);
      const generated = JSON.parse(result.response.text());

      const uuid = uuidv4();
      const data = {
        data: {
          title: title || generated.jobTitle || 'My Resume',
          resumeId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          jobTitle: generated.jobTitle,
          summery: generated.summery,
          themeColor: generated.themeColor || '#4F46E5',
          experience: generated.experience || [],
          education: generated.education || [],
          skills: generated.skills || [],
        }
      };

      const resp = await GlobalApi.CreateNewResume(data);
      toast('Resume generated! Review and edit as needed.');
      navigate('/dashboard/resume/' + resp.data.data.documentId + '/edit');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="h-[280px] rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-purple-50
        flex flex-col items-center justify-center gap-3
        hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300
        cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
         <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
           </div>
        <Sparkles className="text-primary h-8 w-8" />
        <span className="text-sm font-semibold text-ink">Generate with AI</span>
        <span className="text-xs text-ink-muted px-6 text-center">Describe your background, AI builds it</span>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate a Resume with AI</DialogTitle>
            <DialogDescription>
              Describe your role and background. AI drafts a complete resume for you to review and edit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Resume title (e.g. Full Stack Resume)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="e.g. I'm a marketing coordinator with 3 years of experience running social media campaigns and email marketing for a mid-size retail brand. Looking for a senior marketing manager role."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button disabled={!description.trim() || loading} onClick={onGenerate} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating...' : 'Generate Resume'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    
  )
}

export default GenerateResumeAI