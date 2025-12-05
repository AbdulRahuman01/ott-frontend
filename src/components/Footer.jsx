export default function Footer() {
    return (
      <footer className="bg-[#121316] text-gray-400 py-14 px-6 border-t border-gray-800">
  
        <div className="max-w-6xl mx-auto">
  
          {/* Contact line */}
          <p className="mb-6 text-sm">
            Questions? Contact us.
          </p>
  
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
  
            <span className="hover:text-white cursor-pointer">FAQ</span>
            <span className="hover:text-white cursor-pointer">Help Centre</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-white cursor-pointer">Corporate Information</span>
            <span className="hover:text-white cursor-pointer">Media Centre</span>
            <span className="hover:text-white cursor-pointer">Contact Us</span>
  
          </div>
  
          <p className="mt-8 text-sm">© {new Date().getFullYear()} OTTflix</p>
  
        </div>
      </footer>
    );
  }
  