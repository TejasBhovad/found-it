"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useJobSearch } from "./queries/jobs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JobSearch />
    </QueryClientProvider>
  );
}

function JobSearch() {
  const [role, setRole] = useState("Software Engineer");
  const [location, setLocation] = useState("Seattle");
  const [savedJobs, setSavedJobs] = useState(() => {
    // Initialize saved jobs from localStorage
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const { isPending, error, data: jobs } = useJobSearch(role, location);

  const getJobIdentifier = (job) => `${job.title}-${job.company}`;

  const toggleSaveJob = (job) => {
    const jobIdentifier = getJobIdentifier(job);
    setSavedJobs((savedJobs) => {
      if (savedJobs.includes(jobIdentifier)) {
        return savedJobs.filter((id) => id !== jobIdentifier);
      } else {
        return [...savedJobs, jobIdentifier];
      }
    });
  };

  const JobCard = ({ job }) => {
    const jobIdentifier = getJobIdentifier(job);
    const isSaved = savedJobs.includes(jobIdentifier);

    return (
      <Card className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
              {job.company_image ? (
                <img
                  src={job.company_image}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                  No Logo
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSaveJob(job)}
            className={isSaved ? "text-red-500" : "text-gray-400"}
          >
            <Heart
              className="h-5 w-5"
              fill={isSaved ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {job.salary}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {job.location} {job.isRemote && "Remote"}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {job.type}
          </span>
        </div>
        <div className="text-sm text-gray-500">Posted {job.postedAt}</div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex gap-4 bg-gray-100 p-6 rounded-lg">
        <div className="w-full">
          <label
            htmlFor="role-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role-select" className="w-full bg-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Engineer">
                Software Engineer
              </SelectItem>
              <SelectItem value="Engineering Manager">
                Engineering Manager
              </SelectItem>
              <SelectItem value="Artificial Intelligence Engineer">
                Artificial Intelligence Engineer
              </SelectItem>
              <SelectItem value="Machine Learning Engineer">
                Machine Learning Engineer
              </SelectItem>
              <SelectItem value="Backend Engineer">Backend Engineer</SelectItem>
              <SelectItem value="Mobile Engineer">Mobile Engineer</SelectItem>
              <SelectItem value="Product Designer">Product Designer</SelectItem>
              <SelectItem value="Frontend Engineer">
                Frontend Engineer
              </SelectItem>
              <SelectItem value="Data Scientist">Data Scientist</SelectItem>
              <SelectItem value="Full Stack Engineer">
                Full Stack Engineer
              </SelectItem>
              <SelectItem value="Product Manager">Product Manager</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Software Architect">
                Software Architect
              </SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label
            htmlFor="location-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location-select" className="w-full bg-white">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Seattle">Seattle</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isPending ? (
        <div className="text-center">Loading jobs...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : (
        <>
          {/* Display all jobs */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold">Available Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs?.map((job) => (
                <JobCard key={getJobIdentifier(job)} job={job} />
              ))}
            </div>

            {/* Display saved jobs */}
            {savedJobs.length > 0 && (
              <>
                <h2 className="text-xl font-bold">Saved Opportunities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs
                    ?.filter((job) => savedJobs.includes(getJobIdentifier(job)))
                    .map((job) => (
                      <JobCard key={getJobIdentifier(job)} job={job} />
                    ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
