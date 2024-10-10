"use client";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSiteSettings } from "@/context/SiteContext"; // Import SiteContext

// Define the form validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid"),
  study_mode: Yup.string().required("Please select a study mode"),
  course: Yup.string().required("Please select a course"),
  hear_by: Yup.string().required("Please select how you heard about us"), // Add validation for this field
  message: Yup.string()
    .max(1000, "Message can't be longer than 1000 characters")
    .nullable(),
  accept_condition: Yup.boolean().oneOf([true], "You must accept the terms"),
  contact_me: Yup.string().required(
    "Please choose how you want to be contacted"
  ),
});

const Contact: React.FC = () => {
  const { siteSettings, loading: siteLoading } = useSiteSettings(); // Access Site Settings
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]); // For storing courses

  // Fetch courses from the API when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/course`
        );
        if (response.data.status) {
          setCourses(response.data.data); // Store courses in the state
        } else {
          console.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      study_mode: "",
      course: "",
      hear_by: "", // Add this field to the initial values
      message: "",
      accept_condition: false,
      contact_me: "phone",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/contact-us`,
          values
        );

        // Log the response to console for debugging
        console.log("Response:", response);

        if (response.data.status === true) {
          toast.success("Your inquiry has been submitted successfully!");
          formik.resetForm(); // Reset the form after successful submission
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error: any) {
        console.error(
          "Error during submission:",
          error.response || error.message
        );
        toast.error("An error occurred while submitting the form.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section id="contact" className="relative py-20 md:py-[120px] bg-gray-100">
      <div className="container px-4">
        <div className="flex flex-wrap bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-6/12 p-10 bg-[#001d21] text-white">
            <h3 className="text-2xl font-semibold mb-6">Action Centre</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-5 w-5" />
                <p>{siteSettings?.address || "Loading address..."}</p>
              </li>
              <li className="flex items-start space-x-3">
                <FaPhoneAlt className="h-5 w-5" />
                <p>{siteSettings?.number || "Loading phone number..."}</p>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="h-5 w-5" />
                <p>{siteSettings?.email || "Loading email..."}</p>
              </li>
            </ul>

            <hr className="my-8 border-t border-white/20" />

            {/* Social Media Links */}
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {siteSettings?.facebook && (
                <a
                  href={siteSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-xl text-white hover:text-green-400" />
                </a>
              )}
              {siteSettings?.instagram && (
                <a
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl text-white hover:text-green-400" />
                </a>
              )}
              {siteSettings?.linkedin && (
                <a
                  href={siteSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-xl text-white hover:text-green-400" />
                </a>
              )}
              {siteSettings?.youtube && (
                <a
                  href={siteSettings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-xl text-white hover:text-green-400" />
                </a>
              )}
              {siteSettings?.twitter && (
                <a
                  href={siteSettings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-xl text-white hover:text-green-400" />
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-6/12 p-10">
            <h3 className="text-2xl font-semibold mb-6 text-dark">
              Quick Inquiry
            </h3>

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Your Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <select
                  name="study_mode"
                  value={formik.values.study_mode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Study Mode</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
                {formik.touched.study_mode && formik.errors.study_mode ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.study_mode}
                  </p>
                ) : null}
              </div>

              {/* Course Dropdown with dynamic data */}
              <div className="mb-4">
                <select
                  name="course"
                  value={formik.values.course}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {formik.touched.course && formik.errors.course ? (
                  <p className="text-red-500 text-sm">{formik.errors.course}</p>
                ) : null}
              </div>

                {/* New "How did you hear about us" field */}
                <div className="mb-4">
                <select
                  name="hear_by"
                  value={formik.values.hear_by}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="" selected disabled>How did you hear about us?</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Newspaper">Newspaper</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Website">Website</option>
                </select>
                {formik.touched.hear_by && formik.errors.hear_by ? (
                  <p className="text-red-500 text-sm">{formik.errors.hear_by}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Type your message here"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5 focus:ring-1 focus:ring-primary focus:border-primary"
                ></textarea>
                {formik.touched.message && formik.errors.message ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.message}
                  </p>
                ) : null}
              </div>

              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="accept_condition"
                    checked={formik.values.accept_condition}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-sm">Yes, I agree to the privacy policy.</p>
                </div>
                {formik.touched.accept_condition &&
                formik.errors.accept_condition ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.accept_condition}
                  </p>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                  Contact me:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="phone"
                      checked={formik.values.contact_me === "phone"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-1 focus:ring-primary"
                    />
                    <label>By Phone</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="email"
                      checked={formik.values.contact_me === "email"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-1 focus:ring-primary"
                    />
                    <label>By Email</label>
                  </div>
                </div>
                {formik.touched.contact_me && formik.errors.contact_me ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.contact_me}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-full hover:bg-[#57a628] focus:ring-1 focus:ring-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;
