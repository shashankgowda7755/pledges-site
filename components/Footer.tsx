import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-4">Stay updated on next month's special days.</h3>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input type="email" placeholder="Email address" className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" required />
              <button type="submit" className="bg-gray-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800 transition-colors">Subscribe</button>
            </form>
            <p className="text-gray-500 text-sm mt-3">Monthly digest. Unsubscribe anytime.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              <li><a href="mailto:hello@pledgemarks.com" className="text-gray-600 hover:text-gray-900">hello@pledgemarks.com</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Social</h4>
            <ul className="space-y-3">
              <li><a href="https://instagram.com/pledgemarks" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">LinkedIn</a></li>
              <li><a href="https://twitter.com/pledgemarks" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Twitter/X</a></li>
              <li><a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500">
          <p className="font-medium text-gray-900 mb-1">PledgeMarks — Turn Intention into Action.</p>
          <p>© {new Date().getFullYear()} PledgeMarks.</p>
        </div>
      </div>
    </footer>
  );
}
