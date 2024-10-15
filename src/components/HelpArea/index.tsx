"use client";
import { useState } from "react";
import Image from "next/image";

const HelpArea = () => {
  const [activeTab, setActiveTab] = useState("Study & Grow");

  // Tabs with detailed title and description
  const tabs = [
    { 
      title: "Study & Grow", 
      description: "Engage with personalized learning experiences designed to accelerate your academic growth.", 
      content: `Our "Study & Grow" program is rooted in personalized learning, offering each student a tailored path to academic success. Sparx Maths creates an hour’s worth of customized homework assignments each week, aligned with each student's pace and understanding level. 
      
      Through adaptive learning technology, the platform identifies gaps in knowledge and progressively builds on concepts until they are fully understood. Lessons incorporate real-world applications, helping students connect abstract theories with practical examples. The use of spaced repetition and interleaving helps consolidate learning over time, ensuring that students retain key information longer. 

      In addition, the platform encourages critical thinking by posing problems that require more than rote memorization. These challenges are crafted to push students beyond their comfort zones, encouraging intellectual curiosity and fostering independent problem-solving skills.`
    },
    { 
      title: "Test & Score", 
      description: "Test your knowledge and receive real-time feedback with interactive quizzes and assessments.", 
      content: `Regular testing is one of the most effective ways to cement learning. In our "Test & Score" section, students can take quizzes designed to reflect the material they have been studying, ensuring a seamless transition from learning to application.
      
      Our tests range from multiple-choice questions to short-answer problems, with automated scoring that provides immediate feedback. This allows students to track their progress and pinpoint areas that need more attention. The data-driven insights from the tests help students see their performance trends over time, enabling them to identify strengths and weaknesses.

      Additionally, tests are designed to adapt to the student's current level, becoming more challenging as the student improves. This adaptive assessment model ensures that students are continuously challenged but not overwhelmed. Frequent testing encourages regular study habits, boosts retention rates, and helps students feel confident about their progress.`
    },
    { 
      title: "Succeed in Your Exam", 
      description: "Get expert advice on exam techniques, time management, and mental preparation.", 
      content: `Exams are a critical component of the educational journey, and succeeding requires more than just knowing the material. Our "Succeed in Your Exam" section provides a wealth of resources aimed at helping students approach exams with confidence.

      The platform offers detailed revision guides that break down large topics into smaller, digestible chunks. These guides are tailored to specific subjects and exam boards, ensuring that students focus on the most relevant material. Beyond study guides, students will receive expert tips on how to tackle various types of exam questions, from multiple-choice to essay-style responses.

      Furthermore, we recognize that mental preparation is just as important as academic readiness. Our exam success toolkit includes techniques for managing exam stress, such as breathing exercises, visualization techniques, and time management strategies to ensure students feel calm and composed during the exam. With these tools, students can enter the exam room with a clear mind and a focused approach.`
    },
    { 
      title: "Real Exam Questions", 
      description: "Prepare for exams by practicing with real, past exam papers in a simulated test environment.", 
      content: `Nothing prepares you for exams better than practicing with real exam questions. In our "Real Exam Questions" section, students gain access to a comprehensive library of past papers, including questions from multiple exam boards.

      This section simulates the actual exam environment, allowing students to practice under timed conditions. This helps students get accustomed to the pressure of a timed exam, ensuring they can manage their time effectively during the real test. The questions cover a wide range of topics and difficulties, ensuring that students are exposed to the full breadth of what they might encounter in the exam.

      Detailed explanations and solutions accompany each question, helping students understand not only the correct answers but also the reasoning behind them. Practicing with these real-world questions is one of the best ways to build exam confidence, improve speed, and ensure familiarity with the format and expectations of formal assessments.`
    }
  ];

  return (
    <>
    <section className="relative overflow-hidden bg-[#ecf3fc] py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto">
        {/* Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className=" text-3xl sm:text-4xl lg:text-5xl font-bold text-tertiary leading-snug sm:leading-snug lg:leading-tight">
            Wizam Helps Students Aged 11 - 16 to Give Real Exams Online
          </h2>
        </div>
        
        {/* Layout with Tabs and Content */}
        <div className="flex flex-col lg:flex-row items-center  space-y-6 lg:space-y-0">
          {/* Sidebar Tabs with Title and Description */}
          <div className="w-full lg:w-2/6 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.title}
                onClick={() => setActiveTab(tab.title)}
                className={`block w-full text-left px-8 py-4 text-secondary text-lg transition-all duration-200 ${
                  activeTab === tab.title
                    ? "bg-primary "
                    : "bg-white "
                } rounded-lg  hover:bg-primary/20 `}
              >
                <div>
                  <h3 className="font-bold text-2xl">{tab.title}</h3>
                  <p className="mt-1 text-base">
                    {tab.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-4/6 mt-8 lg:mt-0 p-5 lg:p-12 bg-[#DFECF8] rounded-lg ">
            {tabs.map((tab) => (
              activeTab === tab.title && (
                <div key={tab.title}>
                  {/* Image for Each Tab */}
                  <Image 
                    src="/images/study.png" 
                    alt={tab.title} 
                    width={300} 
                    height={300} 
                    className="mx-auto mb-5"
                  />
                  <h2 className="text-3xl text-secondary font-bold mb-4">{tab.title}</h2>
                  <p className="mt-4 text-secondary">
                    {tab.content}
                  </p>
                  <p className="mt-4 text-secondary">
                    Using proven techniques like regular quizzing, exam simulations, and customized study plans, this platform is designed to help students maximize their potential. We integrate modern pedagogical strategies such as spaced repetition and active recall, both scientifically proven to enhance long-term retention and understanding.
                  </p>
                  <p className="mt-4 text-secondary">
                    No matter your starting point, Wizam adapts to your current skill level and goals. Our continuous feedback loops ensure that students stay motivated, allowing them to see their improvements over time. Through a combination of practice, reflection, and revision, students build the knowledge, skills, and mindset needed to succeed in real-world exams.
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

  
      </div>
    </section>
    <section className="bg-[#DFECF8] py-10">
  <div className="container mx-auto px-4">
    <div className="rounded-lg text-center flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Image
        src="/images/approved.png" 
        alt="Verified Badge"
        width={64}
        height={64}
        className="flex-shrink-0"
      />
      <p className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold text-secondary">
        Verified Questions by Top Schools for Best Quality
      </p>
    </div>
  </div>
</section>

    </>
  );
};

export default HelpArea;
