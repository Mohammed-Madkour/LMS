import { assets, dummyTestimonial } from "../../assets/assets";
const TestimonialsSection = () => {
  return (
    <section className="py-16 lg:px-40 px-8  w-full">
      <h2 className="text-3xl font-medium mb-3">Testimonials</h2>
      <p className="text-sm md:text-base text-gray-500">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br /> platform has made a difference in their
        lives.
      </p>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white 
            shadow-[0px_4px_15px_0] shadow-black/5"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10 flex-wrap">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt="testimonial-image"
              />
              <div>
                <h1 className="font-medium text-lg text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-800/80">{testimonial.role}</p>
              </div>
            </div>
            <div className="pb-7 p-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                  key={i}
                    className="h-5"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">Read more</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
