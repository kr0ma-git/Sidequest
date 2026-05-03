import supabase from "../config/supabaseConnection.js";

function formatHoursAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) {
    const min = Math.floor(diffMs / (1000 * 60));
    return `${min}m ago`;
  }

  return `${hours}h ago`;
}

function formatExpiresIn(dateString) {
  const diffMs = new Date(dateString).getTime() - Date.now();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  
  return `${hours}h`;
}

const fetchAllJobs = async (req, res) => {
  try {
    const { data, error } = await supabase.from("jobs").select(`
      *,
      profiles (
        full_name
      )
    `).order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        message: "Failed to fetch jobs",
        error: error.message,
      });
    }

    const formattedJobs = data.map((job) => ({
      id: String(job.id),
      title: job.job_title,
      category: job.category,
      pay: Number(job.pay),
      location: job.location.address,
      coords: {
        latitude: job.location.latitude,
        longitude: job.location.longitude,
      },
      description: job.description,
      postedBy: job.profiles?.full_name ?? "Anonymous",
      postedAt: formatHoursAgo(job.created_at),
      expiresIn: formatExpiresIn(job.expire),
      urgent: job.urgent,
    }));

    return res.status(200).json({
      message: "All jobs fetched",
      success: true,
      jobs: formattedJobs,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Unexpected server error",
      error: err.message || err,
    });
  }
};

/*

try {

} catch(err) {
    return res.status(500).json({
        message: "Unexpected server error",
        error: err.message || err,
    });
}

*/


export {
    // GET
    fetchAllJobs,
}