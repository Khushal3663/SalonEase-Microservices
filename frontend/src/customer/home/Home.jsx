import React from "react";
import Banner from "./Banner";
import HomeServiceCard from "./HomeServiceCard";
import services from "../../data/services";
import SalonList from "../salon/SalonList";

const Home = () => {
  return (
    <div className="space-y-12 lg:space-y-20">
      <section>
        <Banner />
      </section>

      {/* Categories Section */}
      <section className="flex flex-col lg:flex-row items-center gap-10 px-6 md:px-10 lg:px-20">
        <div className="w-full lg:w-1/2">
          <h1 className="text-xl md:text-2xl font-semibold pb-6 md:pb-9 text-center lg:text-left">
            What are you looking for, Bestie?
          </h1>

          {/* Center cards on mobile, left-align on desktop */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-5">
            {services.map((item) => (
              <HomeServiceCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 grid gap-2 md:gap-3 grid-cols-2 grid-rows-12 h-[35vh] md:h-[60vh] lg:h-[90vh]">
          <div className="row-span-7">
            <img
              className="h-full w-full rounded-md object-cover"
              src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="salon service 1"
            />
          </div>

          <div className="row-span-5">
            <img
              className="h-full w-full rounded-md object-cover"
              src="https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="salon service 2"
            />
          </div>

          <div className="row-span-7">
            <img
              className="h-full w-full rounded-md object-cover"
              src="https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="salon service 3"
            />
          </div>

          <div className="row-span-5">
            <img
              className="h-full w-full rounded-md object-cover"
              src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="salon service 4"
            />
          </div>
        </div>
      </section>

      {/* Salon List Section */}
      <section className="px-6 md:px-10 lg:px-20 pb-20">
        <h1 className="text-2xl md:text-3xl font-bold pb-8 md:pb-10 text-center md:text-left">
          Book your favorite salon
        </h1>

        <div className="flex justify-center md:justify-start">
          <SalonList />
        </div>
      </section>
    </div>
  );
};

export default Home;
