"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";
import Loader from "../Common/Loader";

// TypeScript interfaces for form values
interface ProfileFormValues {
  title: string;
  fullname: string;
  mobile: string;
  email: string;
  dob: string; // Keep the date of birth as a string formatted as YYYY-MM-DD
  image: File | null;
}

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

interface UserProfile {
  id: number;
  title: string | null;
  image: string | null;
  name: string;
  email: string;
  phone_number: string;
  dob: string; // Date of birth in YYYY-MM-DD format
}

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();

  // Function to format date from API (or any other source) to `YYYY-MM-DD`
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  // Fetch profile data
  const fetchProfileData = async (): Promise<void> => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 200 && response.data.status === true) {
        const profile = response.data.user;
        setUserProfile({
          ...profile,
          dob: formatDate(profile.dob), // Format the date as YYYY-MM-DD
        });
        setProfileImage(profile.image || "/images/default-user.png");
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Error fetching profile data");
      router.push("/signin");
      setProfileImage("/images/default-user.png");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  if (!userProfile) {
    return <div>Error loading user profile</div>;
  }

  // Initial form values for profile update
  const profileInitialValues: ProfileFormValues = {
    title: userProfile.title || "",
    fullname: userProfile.name,
    mobile: userProfile.phone_number,
    email: userProfile.email,
    dob: userProfile.dob, // Already formatted as YYYY-MM-DD
    image: null, // Image initially null, will be updated on change
  };

  // Initial values for the password form
  const passwordInitialValues: PasswordFormValues = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  };

  // Handle form submission to update profile
  const handleProfileSubmit = async (values: ProfileFormValues): Promise<void> => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
       router.push("/signin");
       return;
    }
 
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("full_name", values.fullname);
    formData.append("phone_number", values.mobile);
    formData.append("email", values.email);
    formData.append("dob", values.dob);
    if (values.image) {
       formData.append("image", values.image);
    }
 
    try {
       const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/update-profile`,
          formData,
          {
             headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "multipart/form-data",
             },
          }
       );
 
       // Confirm response data
       console.log("Response Data:", response.data);
 
       if (response.data.status == true) {
        
          toast.success("Profile updated successfully");
          
          fetchProfileData(); // Optionally re-fetch the updated profile data
       } else {
          toast.error(`Profile update failed: ${response.data.message}`);
       }
    } catch (error: any) {
       const errorMessage = error.response?.data?.message || "Error updating profile";
       toast.error(`Profile update failed: ${errorMessage}`);
       console.error("Error updating profile:", errorMessage);
    }
 };
  // Handle form submission to update password
  const handlePasswordSubmit = async (values: PasswordFormValues): Promise<void> => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/update-password`,
        {
          current_password: values.current_password,
          new_password: values.new_password,
          new_password_confirmation: values.new_password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.data.status === true) {
        toast.success("Password updated successfully");
      } else {
        toast.error(`Password update failed: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error updating password";
      toast.error(`Password update failed: ${errorMessage}`);
      console.error("Error updating password:", errorMessage);
    }
  };

  // Logout from all devices
  const handleLogoutFromAllDevices = async (): Promise<void> => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.data.status === true) {
        // Remove the JWT cookie
        Cookies.remove("jwt");
        router.push("/signin");
        toast.success("Logged out from all devices successfully");
      } else {
        toast.error(`Logout failed: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error logging out from all devices";
      toast.error(`Logout failed: ${errorMessage}`);
      console.error("Error logging out from all devices:", errorMessage);
    }
  };

  return (
    <div>
      <ToastContainer /> 

     
      <UpdateProfile
   profileInitialValues={profileInitialValues}
   profileImage={profileImage}
   handleImageChange={(event) => {
      const file = event.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setProfileImage(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   }}
   onSubmit={handleProfileSubmit}  // Ensure this function is triggered
/>


      {/* Update Password Form */}
      <UpdatePassword
        initialValues={passwordInitialValues}
        onSubmit={handlePasswordSubmit}
      />

      {/* Logout Card */}
      <div className="bg-white shadow-sm rounded-lg p-6 ">
        <h2 className="text-2xl font-semibold mb-4">Browser Session</h2>
        <p className="mb-4 text-gray-600">
        If necessary, you may logout of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
        </p>
        <button
          onClick={handleLogoutFromAllDevices}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Logout Other Browser Session
        </button>
      </div>
    </div>
  );
}
