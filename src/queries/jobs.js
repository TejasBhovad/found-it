import { useQuery } from "@tanstack/react-query";

export const useJobSearch = (jobTitle, jobLocation) => {
  return useQuery({
    queryKey: ["repoData", jobTitle, jobLocation],
    queryFn: async () => {
      const response = await fetch(
        "https://found-it-server.vercel.app/search-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_title: jobTitle,
            job_location: jobLocation,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    },
  });
};
