import { Loader2, Plus } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function AddResume() {

    const [openDialog,setOpenDialog]=useState(false)
    const [resumeTitle,setResumeTitle]=useState('');
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const navigation=useNavigate();

    const onCreate=async()=>{
        setLoading(true)
        const uuid=uuidv4();
        const data={
            data:{
                title:resumeTitle,
                resumeId:uuid,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                userName:user?.fullName
            }
        }

        GlobalApi.CreateNewResume(data).then(resp=>{
            if(resp)
            {
                setLoading(false);
                navigation('/dashboard/resume/'+resp.data.data.documentId+"/edit");
            }
        },(error)=>{
            setLoading(false);
        })
    }

  return (
    <div>
        <div
          className="h-[280px] rounded-xl border-2 border-dashed border-slate-300 bg-white
          flex flex-col items-center justify-center gap-3
          hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300
          cursor-pointer"
          onClick={()=>setOpenDialog(true)}
        >
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-slate-500" />
            </div>
            <span className="text-sm font-semibold text-ink">New Resume</span>
            <span className="text-xs text-ink-muted px-6 text-center">Start from a blank template</span>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
              <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
              <DialogDescription>
                  <p>Add a title for your new resume</p>
                  <Input className="my-2"
                  placeholder="Ex.Full Stack resume"
                  onChange={(e)=>setResumeTitle(e.target.value)}
                  />
              </DialogDescription>
              <div className="flex justify-end gap-3">
                  <Button onClick={()=>setOpenDialog(false)} variant="ghost">Cancel</Button>
                  <Button
                      disabled={!resumeTitle||loading}
                  onClick={()=>onCreate()}>
                      {loading?
                      <Loader2 className="h-4 w-4 animate-spin" /> :'Create'
                  }
                      </Button>
              </div>
              </DialogHeader>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddResume