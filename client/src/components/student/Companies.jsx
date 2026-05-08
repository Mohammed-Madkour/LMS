import { assets } from "../../assets/assets";

const Companies = () => {
  return (
    <section className="pt-16 lg:px-40 px-8">
      <p className="text-[#565656] text-base">Trusted by learners from</p>
      <div className="mt-10 flex flex-wrap gap-6 md:gap-16 items-center justify-center">
        <img
          src={assets.microsoft_logo}
          alt="Microsoft_logo"
          className="w-20 md:w-28"
        />
        <img
          src={assets.walmart_logo}
          alt="Walmart_logo"
          className="w-20 md:w-28"
        />
        <img
          src={assets.accenture_logo}
          alt="Accenture_logo"
          className="w-20 md:w-28"
        />
        <img
          src={assets.adobe_logo}
          alt="Adobe_logo"
          className="w-20 md:w-28"
        />
        <img
          src={assets.paypal_logo}
          alt="Paypal_logo"
          className="w-20 md:w-28"
        />
      </div>
    </section>
  );
};

export default Companies;
