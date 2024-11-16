"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Utility function to remove HTML tags and limit to 250 characters
const sanitizeAndLimitText = (html: string, limit: number): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const plainText = div.textContent || div.innerText || "";
  return plainText.length > limit ? plainText.slice(0, limit) + "..." : plainText;
};

interface ExamDetailProps {
  params: {
    slug: string;
  };
}

const ExamDetailPage = ({ params }: ExamDetailProps) => {
  const { slug } = params;
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Start Exam");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam/${slug}`
        );

        if (response.data.status && response.data.data) {
          setExam(response.data.data);

          // Dynamically set SEO metadata
          const seoData = response.data.data;
          document.title = seoData.title || "Exam Details";

          const setMetaTag = (name: string, content: string, property = false) => {
            const selector = property
              ? `meta[property="${name}"]`
              : `meta[name="${name}"]`;
            let metaTag = document.querySelector(selector) as HTMLMetaElement | null;
            if (metaTag) {
              metaTag.content = content;
            } else {
              metaTag = document.createElement("meta");
              if (property) {
                metaTag.setAttribute("property", name);
              } else {
                metaTag.setAttribute("name", name);
              }
              metaTag.content = content;
              document.head.appendChild(metaTag);
            }
          };

          // Sanitize and limit description to 250 characters
          const plainDescription = sanitizeAndLimitText(
            seoData.description || "",
            250
          );

          setMetaTag("description", plainDescription || "Exam details and instructions");
          setMetaTag("keywords", seoData.keywords || "exam, preparation");
          setMetaTag("og:title", seoData.title, true);
          setMetaTag("og:description", plainDescription, true);
          setMetaTag("og:image", seoData.image || "/default-image.jpg", true);
          setMetaTag("og:url", window.location.href, true);
          setMetaTag("twitter:card", "summary_large_image");
          setMetaTag("twitter:title", seoData.title);
          setMetaTag("twitter:description", plainDescription);
          setMetaTag("twitter:image", seoData.image || "/default-image.jpg");
        } else {
          setError("Failed to fetch exam details.");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setError("An error occurred while fetching the exam details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader />
      </div>
    );
  }

  if (error || !exam) {
    notFound();
    return <NoData message={error || "Exam not found."} />;
  }

  const handleStartExam = () => {
    if (!isChecked) {
      toast.error("Please accept the instructions before proceeding!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setButtonText("Processing...");

    const token = Cookies.get("jwt");
    if (token) {
      Cookies.set(
        "redirect_url",
        `/dashboard/exam-detail/${slug}?sid=${exam.schedule_id}`,
        { expires: 1 }
      );
      router.push(`/dashboard/exam-detail/${slug}?sid=${exam.schedule_id}`);
    } else {
      toast.error("Login to continue!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      Cookies.set("category_id", exam.subcategory_id);
      Cookies.set("category_name", exam.name);
      Cookies.set(
        "redirect_url",
        `/dashboard/exam-detail/${slug}?sid=${exam.schedule_id}`,
        { expires: 1 }
      );
      router.push("/signin");
    }
  };

  return (
    <main>
      <Breadcrumb pageName={exam.title} />
      <section className="container relative z-10 mx-auto -mt-12 pb-20">
        <div className="mb-3 rounded-lg bg-white shadow-lg">
          <div className="flex flex-col items-center space-y-4 p-6 sm:flex-row sm:justify-around sm:space-x-8 sm:space-y-0">
            <div className="text-center">
              <p className="text-lg text-gray-500">Available Between</p>
              <p className="text-xl font-bold text-blue-500">
                {exam.start_date
                  ? `${exam.start_date} ${exam.start_time || ""}`
                  : "N/A"}
                {exam.end_date && exam.end_time
                  ? ` to ${exam.end_date} ${exam.end_time}`
                  : ""}
              </p>
            </div>
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>
            <div className="text-center">
              <p className="text-lg text-gray-500">Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.exam_duration || "N/A"}
              </p>
            </div>
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>
            <div className="text-center">
              <p className="text-lg text-gray-500">Questions</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.questions_count || "N/A"}
              </p>
            </div>
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>
            <div className="text-center">
              <p className="text-lg text-gray-500">Total Marks</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.total_marks || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-6">
          <div
            className="exam-instructions"
            dangerouslySetInnerHTML={{ __html: exam.description }}
          ></div>

          <div className="mt-8">
            <div className="flex items-start">
              <input
                id="instruction-checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-secondary transition duration-200 ease-in-out hover:cursor-pointer focus:ring-secondary"
              />
              <label
                htmlFor="instruction-checkbox"
                className="ml-3 text-sm font-medium text-gray-800 hover:cursor-pointer"
              >
                I have read all the instructions.
              </label>
            </div>

            <button
              onClick={handleStartExam}
              className="mt-6 w-full rounded-full font-semibold bg-primary px-6 py-3 text-secondary transition duration-300 ease-in-out hover:bg-secondary hover:text-white focus:ring-4 focus:ring-primary text-center"
              disabled={buttonText === "Processing..."}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExamDetailPage;
