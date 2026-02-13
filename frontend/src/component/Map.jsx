import React from "react";

const Map = () => {
  // Santosh Nagar, Katraj, Pune
  const latitude = 18.4817;
  const longitude = 73.8552;

  const googleMapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        {/* <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Visit Our Studio
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Come visit us at our art studio in Pune. We'd love to meet you and discuss your custom artwork needs in person.
          </p>
        </div> */}

        {/* Map Container with Enhanced Design */}
        <div className="relative">
          {/* Decorative gradient border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25"></div>

          {/* Map */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              title="Santosh Nagar Katraj Pune"
              src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
              className="w-full h-[400px] md:h-[500px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Location Details & Button */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <span className="text-2xl">📍</span>
              <span>Santosh Nagar, Katraj, Pune, Maharashtra</span>
            </p>
          </div>

          {/* Get Directions Button */}
          <a
            href={googleMapsDirectionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default Map;
