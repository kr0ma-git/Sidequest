import supabase from "../config/supabaseConnection.js";

const fetchAllJobs = async (req, res) => {
    try {
        const { data, error } = await supabase.from("jobs").select();

        if (error) {
            return res.status(500).json({
                message: "Failed to fetch jobs",
                error: {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                },
            });
        }

        return res.status(200).json({
            message: "All Jobs fetched",
            data: data ?? [],
        });

    } catch(err) {
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