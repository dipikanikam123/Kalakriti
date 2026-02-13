import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate, Link } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import Page1 from "./Page1";
import Footer from "../component/Footer";
import { useAuth } from "../context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

// Floating images data
const floatingImages = [
  { src: "https://i.pinimg.com/474x/9b/e9/46/9be946c91ecdc3de107e0b6d3ca2763c.jpg", x: "20%", y: "60%", rot: -30 },
  { src: "https://i.pinimg.com/736x/ac/3e/2c/ac3e2cb024e923d9ebcf35697971d4ae.jpg", x: "80%", y: "15%", rot: 12 },
  { src: "https://i.pinimg.com/736x/e8/e1/f4/e8e1f4fb3a9054093ab55e8475faf8b7.jpg", x: "-15%", y: "5%", rot: 8 },
  { src: "https://i.pinimg.com/1200x/e9/52/0e/e9520e5aad0197b9cd10ceb46c00e478.jpg", x: "80%", y: "50%", rot: 20 },
  { src: "https://i.pinimg.com/736x/ee/61/a9/ee61a94e00c5ee09d53ffac3f71f2920.jpg", x: "60%", y: "5%", rot: -10 },
  { src: "https://i.pinimg.com/736x/12/69/7e/12697e5bbf2bad0944c370d594c672ca.jpg", x: "30%", y: "5%", rot: 15 },
  { src: "https://i.pinimg.com/736x/87/07/1e/87071e1251d498f58b827759b89ee9fa.jpg", x: "50%", y: "65%", rot: -12 },
  { src: "https://i.pinimg.com/736x/da/67/c6/da67c66692ff17cfe175d677956c1294.jpg", x: "10%", y: "30%", rot: -5 },
];

const Home = () => {
  const refs = useRef([]);
  refs.current = [];
  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Function to handle Explore button click
  const handleExploreClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL to explore
      navigate("/login?returnTo=/explore");
    } else {
      navigate("/explore");
    }
  };

  useEffect(() => {
    const lenis = new Lenis({ smooth: true, lerp: 0.08 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    refs.current.forEach((image, i) => {
      gsap.fromTo(
        image,
        { opacity: 0, y: 150, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: floatingImages[i].rot,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: image, start: "top 80%" },
        }
      );
    });

    return () => ScrollTrigger.killAll();
  }, []);

  return (
    <div className="w-screen overflow-x-hidden">
      {/* Hero Section with Enhanced CTAs */}
      <section className="relative w-screen h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 overflow-hidden flex items-center justify-center px-4 md:px-10">
        <div className="text-center z-20 max-w-4xl">
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold stylish-font text-black animate-fade-in">
            <span className="text-orange-600">*K a l a</span>k r i t i*
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mt-6 mb-8">
            <span className="text-purple-500 font-semibold">A stunning visual journey</span>
            <br />
            <span className="text-gray-600 text-lg">Discover unique artworks that tell meaningful stories</span>
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleExploreClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Explore Gallery
            </button>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-50 text-purple-600 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-600"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Floating Images */}
        {floatingImages.map((img, i) => (
          <div
            key={i}
            ref={addToRefs}
            className="absolute w-36 md:w-44 lg:w-48 h-52 md:h-60 lg:h-64 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-300 transition-shadow duration-300"
            style={{ left: img.x, top: img.y }}
          >
            <img
              src={img.src}
              alt={`Artwork ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Kalakriti?</h2>
            <p className="text-gray-600 text-lg">Experience art like never before</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <svg className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Unique Artworks</h3>
              <p className="text-gray-600 leading-relaxed">Handpicked collection of original art pieces from talented artists around the world</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <svg className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">Affordable pricing with secure payment options and money-back guarantee</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <svg className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">High-quality prints and materials ensuring your artwork lasts for generations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <Page1 />

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                About <span className="text-purple-600">Kalakriti</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kalakriti reflects the beauty of creativity—where art, colors, and ideas come together to tell meaningful stories. We are passionate about bringing unique artworks to art lovers and collectors.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our platform connects talented artists with art enthusiasts, creating a vibrant community where creativity thrives. Every piece in our collection is carefully curated to ensure quality and authenticity.
              </p>
              {/* <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-semibold">100+ Artworks</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-semibold">50+ Artists</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-semibold">1000+ Happy Customers</span>
                </div>
              </div> */}
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://i.pinimg.com/736x/ad/60/8c/ad608c80f4ae2421fc2cb8b54213c75c.jpg"
                  alt="Art Gallery 1"
                  className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-64 object-cover"
                />
                <img
                  src="https://i.pinimg.com/736x/16/02/f1/1602f1a884f9a759dcfc30fcc59531ce.jpg"
                  alt="Art Gallery 2"
                  className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-64 object-cover mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real stories from art lovers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
      {/* Testimonial 1 */}
      {/* <div className="bg-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"Absolutely stunning collection! I found the perfect piece for my living room. The quality exceeded my expectations."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="font-bold text-gray-800">Priya Sharma</p>
                  <p className="text-sm text-gray-600">Art Collector</p>
                </div>
              </div>
            </div> */}

      {/* Testimonial 2 */}
      {/* <div className="bg-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"Great service and beautiful artworks. The team was very helpful in choosing the right piece for my office."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <p className="font-bold text-gray-800">Rahul Mehta</p>
                  <p className="text-sm text-gray-600">Interior Designer</p>
                </div>
              </div>
            </div> */}

      {/* Testimonial 3 */}
      {/* <div className="bg-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"I love how easy it is to browse and purchase. The artwork arrived perfectly packaged and looks amazing!"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-bold text-gray-800">Ananya Desai</p>
                  <p className="text-sm text-gray-600">Home Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Art Journey Today</h2>
          <p className="text-xl text-purple-100 mb-10">
            Discover unique artworks that will transform your space and inspire your soul
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleExploreClick}
              className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Browse Collection
            </button>
            <Link
              to="/contact"
              className="bg-purple-700 hover:bg-purple-900 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default Home;
