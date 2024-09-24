import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
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
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Phone Number"
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
              </div>
              <div className="mb-4">
                <select className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2">
                  <option>Select Study Mode</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                </select>
              </div>
              <div className="mb-4">
                <select className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2">
                  <option>Select Course</option>
                  <option>Course 1</option>
                  <option>Course 2</option>
                </select>
              </div>
              <div className="mb-4">
                <select className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2">
                  <option>How did you hear about us?</option>
                  <option>Friend</option>
                  <option>Social Media</option>
                </select>
              </div>
              <div className="mb-4">
                <textarea
                  rows={4}
                  placeholder="Type your message here"
                  className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                ></textarea>
              </div>
              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <p className="text-sm">Yes, I agree to the processing of my personal data in line with the school's privacy policy.</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Contact me:</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact-method"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label>By Phone</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact-method"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label>By Email</label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-3 rounded-full hover:bg-[#57a628]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
