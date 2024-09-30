"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

// Define the form validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid").nullable(),
  study_mode: Yup.string(),
  course: Yup.string().required("Please select a course"),
  hear_by: Yup.string(),
  message: Yup.string().max(1000, "Message can't be longer than 1000 characters").nullable(),
  accept_condition: Yup.boolean().oneOf([true], "You must accept the terms"),
  contact_me: Yup.string().required("Please choose how you want to be contacted"),
});

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Formik setup with initial values and validation schema
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
      console.log("Submitting form with values:", values); // Log form values
      setLoading(true);
      setSubmitMessage(null); // Reset message before submitting

      try {
        const response = await axios.post(`https://wizam.awmtab.in/api/contact-us`, values);

        if (response.status === 200) {
          setSubmitMessage("Your inquiry has been submitted successfully!");
          formik.resetForm();
        } else {
          setSubmitMessage("Something went wrong. Please try again.");
        }
      } catch (error: any) {
        console.error("Error during submission:", error.response || error.message);
        setSubmitMessage("An error occurred while submitting the form.");
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
                <FaMapMarkerAlt className="h-6 w-6" />
                <p>3 The Mount, London W3 9NW, United Kingdom</p>
              </li>
              <li className="flex items-start space-x-3">
                <FaPhoneAlt className="h-6 w-6" />
                <p>0208 993 4500</p>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="h-6 w-6" />
                <p>info@wizami.com</p>
              </li>
            </ul>

            <hr className="my-8 border-t border-white/20" />

            <h4 className="text-xl font-semibold mb-4">Direction</h4>
            <ul className="space-y-2 text-white">
              <li>We are centrally located in Acton High Street, Acton, West London.</li>
              <li>10-minute walk from Acton Town Underground Station.</li>
              <li>25 minutes by tube from Piccadilly Circus.</li>
              <li>Only 9 stops away from London Heathrow Airport.</li>
            </ul>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-6/12 p-10">
            <h3 className="text-2xl font-semibold mb-6 text-dark">Quick Inquiry</h3>

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-transparent rounded-md border py-[10px] px-5 ${
                    formik.touched.name && formik.errors.name ? "border-red-500" : ""
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
                  className={`w-full bg-transparent rounded-md border py-[10px] px-5 ${
                    formik.touched.email && formik.errors.email ? "border-red-500" : ""
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
                  className="w-full bg-transparent rounded-md border py-[10px] px-5"
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
                  className="w-full bg-transparent rounded-md border py-[10px] px-5"
                >
                  <option value="">Select Study Mode</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>

              <div className="mb-4">
                <select
                  name="course"
                  value={formik.values.course}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-transparent rounded-md border py-[10px] px-5"
                >
                  <option value="">Select Course</option>
                  <option value="course1">Course 1</option>
                  <option value="course2">Course 2</option>
                </select>
                {formik.touched.course && formik.errors.course ? (
                  <p className="text-red-500 text-sm">{formik.errors.course}</p>
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
                  className="w-full bg-transparent rounded-md border py-[10px] px-5"
                ></textarea>
                {formik.touched.message && formik.errors.message ? (
                  <p className="text-red-500 text-sm">{formik.errors.message}</p>
                ) : null}
              </div>

              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="accept_condition"
                    checked={formik.values.accept_condition}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <p className="text-sm">Yes, I agree to the privacy policy.</p>
                </div>
                {formik.touched.accept_condition && formik.errors.accept_condition ? (
                  <p className="text-red-500 text-sm">{formik.errors.accept_condition}</p>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Contact me:</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="phone"
                      checked={formik.values.contact_me === "phone"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-primary border-gray-300"
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
                      className="h-4 w-4 text-primary border-gray-300"
                    />
                    <label>By Email</label>
                  </div>
                </div>
                {formik.touched.contact_me && formik.errors.contact_me ? (
                  <p className="text-red-500 text-sm">{formik.errors.contact_me}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-white py-3 rounded-full hover:bg-[#57a628]"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            {/* Success Message */}
            {submitMessage && (
              <p className="mt-4 text-green-600 text-lg font-semibold">{submitMessage}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
