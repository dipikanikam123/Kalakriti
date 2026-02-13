import React, { useState } from "react";
import Footer from "./Footer";
import Map from "./Map";
import api from "../utils/api";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8080"; // backend URL

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // ===== GALLERY IMAGE UPLOAD =====
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryPhotos((prev) => [...prev, ...newPhotos]);
  };

  // ===== REMOVE IMAGE =====
  const removePhoto = (index) => {
    setGalleryPhotos(galleryPhotos.filter((_, i) => i !== index));
  };

  // ===== SUBMIT TO BACKEND =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 Form submission started");
    console.log("Form data:", { name, email, phone, address, message, imageCount: galleryPhotos.length });

    // Validation
    if (!name || !email || !phone || !address || !message) {
      console.error("❌ Validation failed: Missing required fields");
      return toast.error("All fields are required! ❌");
    }
    if (!/^\d{10}$/.test(phone)) {
      console.error("❌ Validation failed: Invalid phone number");
      return toast.error("Please enter a valid 10-digit mobile number 📱");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("message", message);

    galleryPhotos.forEach((p) => {
      formData.append("images", p.file);
    });

    console.log("📤 Sending request to /admin endpoint");

    try {
      // Using api utility (Base URL handled automatically)
      // Axios automatically sets Content-Type to multipart/form-data with boundary for FormData
      const response = await api.post("/admin", formData);

      console.log("✅ Success response:", response.data);
      toast.success("Your request has been sent successfully! 🎉");

      // clear form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMessage("");
      setGalleryPhotos([]);
    } catch (err) {
      console.error("❌ Error details:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);

      const errorMessage = err.response?.data || err.message || "Failed to send request";
      // Ensure we display string if data is object
      const displayMsg = typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage;
      toast.error(`Error: ${displayMsg} ❌`);
    }
  };

  return (
    <>
      <div className="w-full">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-[45vh] w-full">
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600"
            alt="Contact"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 flex items-center justify-center h-full text-white">
            <h1 className="text-4xl md:text-5xl font-semibold">Contact & Commissions</h1>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-10 rounded-xl shadow-md">

            {/* LEFT FORM */}
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Request an Artwork</h3>
              <p className="text-gray-500 text-sm mb-6">Want a custom sketch or painting? Fill out the details below.</p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhone(val);
                    }}
                    required
                    className="w-full px-4 py-3 rounded-md border text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Mention if you want a sketch or painting, and any specific requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* GALLERY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Reference Photo (Optional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="text-xs text-gray-500">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryChange}
                      />
                    </label>
                  </div>
                </div>

                {/* PREVIEW */}
                {galleryPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {galleryPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.preview}
                          alt="preview"
                          className="h-20 w-full object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-lg shadow-lg transition transform active:scale-95 mt-4"
                >
                  Send Request
                </button>
              </form>
            </div>

            {/* RIGHT INFO */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 mt-[150px]">
                Always Here to Help you
              </h2>
              <p className="text-gray-600 mb-8">
                There are variations of passages of Lorem Ipsum available.
              </p>

              <div className="space-y-6 text-gray-700">
                <div className="flex gap-4">
                  <span>📍</span>
                  <p>Santosh Nagar, Katraj (Pune)</p>
                </div>

                <div className="flex gap-4">
                  <span>📞</span>
                  <p>+91 9657111483</p>
                </div>

                <div className="flex gap-4">
                  <span>✉️</span>
                  <a
                    href="mailto:kalakriti@email.com"
                    className="text-blue-600 hover:underline"
                  >
                    kalakriti@email.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Map />

      <Footer />
    </>
  );
};

export default Contact;
