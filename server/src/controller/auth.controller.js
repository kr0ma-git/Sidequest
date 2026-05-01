import supabase from "../config/supabaseConnection.js";

const userSignUp = async (req, res) => {
  try {
    const { fullName, email, password, username } = req.body;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
      return res.status(400).json({
        message: "Failed to sign up into Supabase",
        error: signUpError.message,
      });
    }

    if (!signUpData?.user?.id) {
        return res.status(400).json({
            message: "User was not fully created (email confirmation may be required)",
        });
    }

    const { data: profileData, error: profileError } = await supabase.from("profiles").insert({
        id: signUpData.user.id,
        email,
        username,
        full_name: fullName,
      });

    if (profileError) {
      return res.status(400).json({
        message: "Failed to create profile",
        error: profileError.message,
      });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: signUpData.user,
      profile: profileData,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Unexpected server error",
      error: err.message || err,
    });
  }
};

/* Login is done with the fronend to keep local session.
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error, status } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return res.status(400).json({
                message: "Failed to login",
                error: {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                }
            });
        }

        return res.status(200).json({
            message: "User logged in",
            user: data.user,
            session: data.session,
        });
    } catch(err) {
        return res.status(500).json({
            message: "Unexpected server error",
            error: err.message || err,
        });
    }
}
*/

export {
    // POST
    userSignUp,
    //userLogin,
}