import { Loader2Icon, MoreVertical, Copy, Clock } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import GlobalApi from './../../../service/GlobalApi'
import { toast } from 'sonner'
import { timeAgo } from '@/lib/utils'

function ResumeCardItem({resume,refreshData}) {

  const navigation=useNavigate();
  const [openAlert,setOpenAlert]=useState(false);
  const [loading,setLoading]=useState(false);
  const [duplicating,setDuplicating]=useState(false);

  const onDelete=()=>{
    setLoading(true);
    GlobalApi.DeleteResumeById(resume.documentId).then(()=>{
      toast('Resume deleted');
      refreshData()
      setLoading(false);
      setOpenAlert(false);
    },()=>{
      setLoading(false);
      toast.error('Failed to delete resume');
    })
  }

  const onDuplicate=async()=>{
    setDuplicating(true);
    try {
      const resp = await GlobalApi.GetResumeById(resume.documentId);
      const { documentId, createdAt, updatedAt, resumeId, ...rest } = resp.data.data;
      const newData = {
        data: {
          ...rest,
          resumeId: uuidv4(),
          title: `${rest.title || 'Untitled'} (Copy)`,
        }
      };
      await GlobalApi.CreateNewResume(newData);
      toast('Resume duplicated');
      refreshData();
    } catch (error) {
      toast.error('Failed to duplicate resume');
    } finally {
      setDuplicating(false);
    }
  }

  return (
    <div className='group'>
      <div className='rounded-xl overflow-hidden border border-slate-200 shadow-sm
hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white'>
        <Link to={'/dashboard/resume/'+resume.documentId+"/edit"}>
          <div className='p-14 bg-gradient-to-b
            from-pink-100 via-purple-200 to-blue-200
          h-[280px]
            border-t-4
          '
          style={{
            borderColor:resume?.themeColor
          }}
          >
            <div className='flex items-center justify-center h-[180px]'>
              <img src="/cv.png" width={80} height={80} />
            </div>
          </div>
        </Link>

        <div className='p-3 flex justify-between items-center text-white'
         style={{
          background:resume?.themeColor
        }}>
          <div className='min-w-0'>
            <h2 className='text-sm font-medium truncate'>{resume.title}</h2>
            {resume.updatedAt && (
              <p className='text-[11px] opacity-80 flex items-center gap-1 mt-0.5'>
                <Clock className='h-3 w-3' /> Updated {timeAgo(resume.updatedAt)}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className='h-4 w-4 cursor-pointer flex-shrink-0'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>navigation('/dashboard/resume/'+resume.documentId+"/edit")}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.documentId+"/view")}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.documentId+"/view")}>Download</DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate} disabled={duplicating}>
                <Copy className='h-3.5 w-3.5 mr-2' />
                {duplicating ? 'Duplicating...' : 'Duplicate'}
              </DropdownMenuItem>
              <DropdownMenuItem className='text-red-600' onClick={()=>setOpenAlert(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. "{resume.title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading? <Loader2Icon className='animate-spin h-4 w-4'/>:'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ResumeCardItem