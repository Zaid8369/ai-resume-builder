import React, { useEffect, useMemo, useState } from 'react'
import AddResume from './components/AddResume'
import GenerateResumeAI from './components/GenerateResumeAI'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Search, FileText } from 'lucide-react'

function Dashboard() {

  const {user}=useUser();
  const [resumeList,setResumeList]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [sortBy,setSortBy]=useState('recent');

  useEffect(()=>{
    user&&GetResumesList()
  },[user])

  const GetResumesList=()=>{
    setLoading(true)
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
    .then(resp=>{
      setResumeList(resp.data.data);
      setLoading(false)
    })
    .catch(()=>setLoading(false))
  }

  const visibleResumes = useMemo(() => {
    let list = resumeList.filter(r =>
      (r.title || '').toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'name') {
      list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      list = [...list].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    }
    return list;
  }, [resumeList, search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-10 md:px-20 lg:px-32">
        <div className="pb-6 mb-8 border-b border-slate-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-3xl text-ink tracking-tight">My Resumes</h2>
            <p className="text-ink-muted mt-1 text-sm">
              {resumeList.length > 0
                ? (resumeList.length + ' resume' + (resumeList.length > 1 ? 's' : '') + ' \u00b7 create and manage AI-powered resumes')
                : 'Create and manage AI-powered resumes tailored to your next job role'}
            </p>
          </div>

          {resumeList.length > 0 && (
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <Input
                  placeholder="Search resumes..."
                  className="pl-9 w-56 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-white">
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'recent' ? 'Recent' : 'Name'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>Recently updated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>Name (A-Z)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <AddResume/>
          <GenerateResumeAI/>
          <ResumeAnalyzer/>
          {loading ? (
            [1,2,3,4].map((item,index)=>(
              <div key={index} className="h-[280px] rounded-xl bg-slate-200 animate-pulse"></div>
            ))
          ) : (
            visibleResumes.map((resume)=>(
              <ResumeCardItem resume={resume} key={resume.documentId} refreshData={GetResumesList} />
            ))
          )}
        </div>

        {!loading && resumeList.length > 0 && visibleResumes.length === 0 && (
          <div className="mt-16 text-center text-ink-muted">
            <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            {'No resumes match "' + search + '"'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard