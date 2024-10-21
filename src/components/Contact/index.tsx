"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
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
  hear_by: Yup.string().required("Please select how you heard about us"),
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
      hear_by: "",
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
    <section id="contact" className="relative py-10 md:py-[60px] bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-6/12 p-12 bg-tertiary text-white flex flex-col ">
            <div>
              <h3 className="text-3xl font-semibold mb-6">Action Centre</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="h-5 w-5" />
                  <p>
                    {siteSettings?.address ||
                      "3 The Mount, London W3 9NW, United Kingdom"}
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <FaPhoneAlt className="h-5 w-5" />
                  <p>{siteSettings?.number || "0208 993 4500"}</p>
                </li>
                <li className="flex items-start space-x-3">
                  <FaEnvelope className="h-5 w-5" />
                  <p>{siteSettings?.email || "info@wizam.com"}</p>
                </li>
              </ul>
            </div>
            <hr className="h-px my-12 bg-gray-100 border-0 dark:bg-gray-700" />

            <div className="mb-3">
              <h4 className="text-3xl font-semibold mb-4">Direction</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  We are centrally located in Acton High Street, Acton, West
                  London.
                </li>
                <li>
                  10-minute walk from Acton Town Underground Station / Acton
                  Main/Acton Central.
                </li>
                <li>25 minutes by tube from Piccadilly Circus.</li>
                <li>Only 9 stops away from London Heathrow Airport.</li>
              </ul>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full lg:w-6/12 p-10">
            <h3 className="text-2xl font-bold  text-gray-800 text-center">
              Quick Inquiry
            </h3>
            <hr className="h-px my-6 bg-gray-100 border-0 dark:bg-gray-700" />

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1  gap-4">
                {/* Name */}
                <div className="col-span-1 sm:col-span-1">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-1">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number*"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Study Mode */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="study_mode"
                    value={formik.values.study_mode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white border-gray-300"
                  >
                    <option value="">Study Mode*</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                  {formik.touched.study_mode && formik.errors.study_mode && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.study_mode}
                    </p>
                  )}
                </div>

                {/* Course */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="course"
                    value={formik.values.course}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white border-gray-300"
                  >
                    <option value="">Course*</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.course && formik.errors.course && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.course}
                    </p>
                  )}
                </div>

                {/* How did you hear about us */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="hear_by"
                    value={formik.values.hear_by}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white border-gray-300"
                  >
                    <option value="">How did you hear about us?*</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Newspaper">Newspaper</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Website">Website</option>
                  </select>
                  {formik.touched.hear_by && formik.errors.hear_by && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.hear_by}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="col-span-1 sm:col-span-1">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white rounded-md border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white border-gray-300"
                  ></textarea>
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.message}
                    </p>
                  )}
                </div>

                {/* Checkbox */}
                <div className="col-span-1 sm:col-span-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="accept_condition"
                    checked={formik.values.accept_condition}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-white"
                  />
                  <p className="text-sm">
                    Yes, I agree to the processing of my personal data in line
                    with the school's privacy policy.
                  </p>
                </div>
                {formik.touched.accept_condition &&
                  formik.errors.accept_condition && (
                    <p className="col-span-2 text-red-500 text-sm">
                      {formik.errors.accept_condition}
                    </p>
                  )}

                {/* Radio Buttons */}
                <div className="col-span-1 sm:col-span-1 flex items-center space-x-4 mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Contact me:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="phone"
                      checked={formik.values.contact_me === "phone"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-white"
                    />
                    <label>By phone</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="email"
                      checked={formik.values.contact_me === "email"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-white"
                    />
                    <label>By email</label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-1">
                  <button
                    type="submit"
                    className="w-full primary-button"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;
