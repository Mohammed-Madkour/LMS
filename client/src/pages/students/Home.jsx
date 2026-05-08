import CallToAction from "../../components/student/CallToAction";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CoursesSection";
import Footer from "../../components/student/Footer";
import Hero from "../../components/student/Hero";
import TestimonialsSection from "../../components/student/TestimonialsSection";

const Home = () => {
  return (
    <div className="flex items-center flex-col space-y-7 text-center">
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
    </div>
  );
};

export default Home;
