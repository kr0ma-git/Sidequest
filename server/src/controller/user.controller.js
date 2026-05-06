import supabase from "../config/supabaseConnection.js";

// fetch user profile by id
export const fetchUserProfile = async (req, res) => {

    if (!req.user || !req.user.id) { // Check if user credentials are present in the request
        return res.status(401).json({
            message: "Unauthorized: No user credentials found",
        });
    }

    const id = req.user.id;
    try {
        const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
        
        if (error) {
            return res.status(400).json({
                message: "Failed to fetch user profile",
                error: error.message,
            });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });

    }

}



