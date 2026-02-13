import React from "react";
import img from "../assets/image/image2.png";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="w-full min-h-screen bg-[#faf8fb] overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Background gradient circle */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 rounded-full blur-3xl opacity-60"></div>

        {/* Image */}
        <div className="relative flex justify-center">
          <div className="bg-white p-3 rounded-2xl shadow-xl mt-10">
            <img
              src={img}
              alt="Artistic Mind"
              className="w-[380px] rounded-xl"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative">
          <h1 className="text-5xl font-serif font-bold text-gray-800 mb-4">
            Artistic Mind
          </h1>

          <p className="uppercase text-sm tracking-widest text-orange-400 mb-6">
            Multidimensional Artist · Victoria Khamnov
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            An artistic mind sees beauty beyond the obvious, finding meaning in
            colors, shapes, and emotions. It turns imagination into expression
            and ideas into visual stories that speak without words. Driven by
            curiosity and passion, an artistic mind doesn’t just create art—it
            creates feeling, connection, and a new way of seeing the world.
          </p>

          <p className="italic text-gray-500 mb-8">
            “Art begins where words fall short.”
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-4 py-2 rounded-full border bg-white text-sm">
              💙 Painting
            </span>
            <span className="px-4 py-2 rounded-full border bg-white text-sm">
              🎨 Illustration
            </span>
            <span className="px-4 py-2 rounded-full border bg-white text-sm">
              🌈 Visual Storytelling
            </span>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Blog;
