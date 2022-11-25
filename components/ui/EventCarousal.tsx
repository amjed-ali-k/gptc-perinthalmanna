import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import ImagePost from "../custom/ImagePost";
import useSWR from "swr";
import { fetcher } from "../../server/calls";
import { FcHighPriority } from "react-icons/fc";

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1028: { items: 3 },
  1280: { items: 4 },
};

interface Event {
  title: string;
  subtitle: string;
  image: string;
  date: string;
}

const EventCarousel = ({
  id,
  fetchAll = false,
}: {
  id?: string;
  fetchAll?: boolean;
}) => {
  const _id = fetchAll ? "all" : id;
  const { data, error } = useSWR<Event[]>("/api/events/" + _id, fetcher);

  if (error)
    return (
      <div className="flex p-2 select-none sm:p-4 sm:h-64 rounded-2xl">
        <div className="flex items-center justify-center w-full text-xl font-bold text-center text-red-600 bg-gray-200 h-52 rounded-xl">
          <p>Data Failed to load</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col p-2 select-none sm:p-4 sm:h-64 rounded-2xl sm:flex-row">
        <div className="bg-gray-200 h-52 sm:h-full sm:w-full rounded-xl animate-pulse"></div>
      </div>
    );

  if (data.length === 0) {
    return (
      <div className="p-2 select-none sm:p-4 sm:h-22 rounded-2xl">
        <div className="flex flex-row items-center justify-center h-32 bg-gray-50 sm:h-22 sm:w-full rounded-xl">
          {" "}
          <p className="flex items-center text-xl ">
            {" "}
            <FcHighPriority className="mr-2" /> No events found.
          </p>
        </div>
      </div>
    );
  }

  const _items = data?.map((event) => (
    <div key={event.title} className="pr-4">
      <ImagePost
        image={event.image}
        date={event.date}
        title={event.title}
        subtitle={event.subtitle}
      />
    </div>
  ));

  return (
    <AliceCarousel
      autoPlay
      autoPlayInterval={5000}
      mouseTracking
      touchTracking
      keyboardNavigation
      items={_items}
      responsive={responsive}
      disableButtonsControls
      disableDotsControls
      disableSlideInfo
    />
  );
};

export default EventCarousel;
