"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Eye, BarChart3, Shield, Globe, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

const CookiePolicy = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    preferences: true
  });

  const cookieTypes = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Essential Cookies",
      description: "Required for basic website functionality",
      required: true,
      examples: [
        "Session management and user authentication",
        "Shopping cart functionality",
        "Security and fraud prevention",
        "Load balancing and performance",
        "GDPR compliance and cookie consent preferences"
      ],
      duration: "Session or up to 1 year",
      canDisable: false
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Cookies",
      description: "Help us understand how visitors use our website",
      required: false,
      examples: [
        "Google Analytics - visitor behavior and site usage",
        "Page views, session duration, and bounce rates",
        "Traffic sources and referral information",
        "Popular products and search terms",
        "Device and browser information for optimization"
      ],
      duration: "Up to 2 years",
      canDisable: true
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Marketing Cookies",
      description: "Used to deliver personalized advertisements",
      required: false,
      examples: [
        "Facebook Pixel and Google Ads tracking",
        "Retargeting and remarketing campaigns",
        "Personalized product recommendations",
        "Cross-platform advertising optimization",
        "A/B testing for marketing campaigns"
      ],
      duration: "Up to 1 year",
      canDisable: true
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Preference Cookies",
      description: "Remember your choices and personalize your experience",
      required: false,
      examples: [
        "Language and region preferences",
        "Currency and measurement unit settings",
        "Theme preferences (dark/light mode)",
        "Customized layout and display options",
        "Recently viewed products and wish lists"
      ],
      duration: "Up to 1 year",
      canDisable: true
    }
  ];

  const thirdPartyCookies = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and performance tracking",
      link: "https://policies.google.com/privacy",
      cookies: ["_ga", "_gid", "_gat"]
    },
    {
      name: "Facebook Pixel",
      purpose: "Social media advertising and remarketing",
      link: "https://www.facebook.com/privacy/policy/",
      cookies: ["_fbp", "fr"]
    },
    {
      name: "Stripe",
      purpose: "Payment processing and fraud prevention",
      link: "https://stripe.com/privacy",
      cookies: ["__stripe_sid", "__stripe_mid"]
    },
    {
      name: "Hotjar",
      purpose: "User experience and behavior analysis",
      link: "https://www.hotjar.com/privacy/",
      cookies: ["_hjid", "_hjSession"]
    }
  ];

  const toggleCookiePreference = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Can't disable essential cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getCookieKey = (title: string): keyof typeof cookiePreferences => {
    const key = title.toLowerCase().split(' ')[0];
    if (key === 'essential' || key === 'analytics' || key === 'marketing' || key === 'preferences') {
      return key as keyof typeof cookiePreferences;
    }
    return 'essential'; // fallback
  };

  const savePreferences = () => {
    // In a real app, you would save these preferences to localStorage or send to server
    console.log('Saving cookie preferences:', cookiePreferences);
    alert('Cookie preferences saved!');
  };

  const clearAllCookies = () => {
    if (confirm('Are you sure you want to clear all non-essential cookies? This will reset your preferences and log you out.')) {
      // In a real app, you would clear cookies here
      console.log('Clearing all cookies');
      alert('Cookies cleared!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] p-4 rounded-full">
              <Cookie className="h-8 w-8 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            Learn about the cookies we use and how you can control them.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>

        {/* What are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-[#00ffff]/10 to-[#2afdfd]/10 border border-[#00ffff]/30 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">What are Cookies?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
              <h3 className="font-semibold text-[#00ffff] mb-2">Why we use cookies:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Keep you logged in</li>
                <li>• Remember your shopping cart</li>
                <li>• Personalize your experience</li>
                <li>• Improve our website performance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#00ffff] mb-2">Your control:</h3>
              <p className="text-gray-300 text-sm mb-4">
                You can control and delete cookies through your browser settings or using our preference center below. 
                However, disabling certain cookies may affect your experience on our website.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={savePreferences}
                  className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#2afdfd] hover:to-[#00ffff] transition-all duration-300 w-full sm:w-auto"
                >
                  Manage Preferences
                </button>
                <button 
                  onClick={clearAllCookies}
                  className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-500 transition-all duration-300 w-full sm:w-auto"
                >
                  Clear Cookies
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cookie Preference Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-3 text-[#00ffff]" />
            Cookie Preference Center
          </h2>
          <p className="text-gray-300 mb-6">
            Choose which types of cookies you&apos;re comfortable with. Essential cookies cannot be disabled as they&apos;re required for basic website functionality.
          </p>
          
          <div className="space-y-6">
            {cookieTypes.map((type, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 sm:p-6 bg-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] p-2 rounded-lg mr-4 flex-shrink-0">
                      {React.cloneElement(type.icon, { className: "h-5 w-5 text-gray-900" })}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white break-words">{type.title}</h3>
                      <p className="text-sm text-gray-300 break-words">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {type.canDisable ? (
                      <button
                        onClick={() => toggleCookiePreference(getCookieKey(type.title))}
                        className="flex items-center"
                      >
                        {cookiePreferences[getCookieKey(type.title)] ? (
                          <ToggleRight className="h-8 w-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-gray-400" />
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center text-sm text-gray-400">
                        <Shield className="h-4 w-4 mr-1" />
                        Required
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-[#00ffff] mb-2">Examples:</h4>
                    <ul className="text-gray-300 space-y-1">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="break-words">• {example}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#00ffff] mb-2">Duration:</h4>
                    <p className="text-gray-300 break-words">{type.duration}</p>
                    {!type.required && (
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          cookiePreferences[type.title.toLowerCase().split(' ')[0] as keyof typeof cookiePreferences]
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cookiePreferences[type.title.toLowerCase().split(' ')[0] as keyof typeof cookiePreferences] ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button 
              onClick={savePreferences}
              className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:from-[#2afdfd] hover:to-[#00ffff] transition-all duration-300"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>

        {/* Third Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Globe className="h-6 w-6 mr-3 text-[#00ffff]" />
            Third-Party Cookies
          </h2>
          <p className="text-gray-300 mb-6">
            We use cookies from trusted third-party services to enhance functionality and provide analytics. 
            You can learn more about their privacy practices by visiting their privacy policies.
          </p>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {thirdPartyCookies.map((service, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                <h3 className="font-semibold text-white mb-2 break-words">{service.name}</h3>
                <p className="text-sm text-gray-300 mb-3 break-words">{service.purpose}</p>
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-[#00ffff] mb-1">Cookie Names:</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.cookies.map((cookie, cookieIndex) => (
                      <span key={cookieIndex} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs break-all">
                        {cookie}
                      </span>
                    ))}
                  </div>
                </div>
                <a 
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ffff] text-sm font-semibold hover:text-[#2afdfd] transition-colors break-words"
                >
                  View Privacy Policy →
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Browser Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 text-white"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Eye className="h-6 w-6 mr-3" />
            Browser Cookie Controls
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Browser Settings</h3>
              <p className="text-gray-300 text-sm mb-4">
                Most browsers allow you to control cookies through their settings. You can typically:
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• View and delete existing cookies</li>
                <li>• Block all cookies</li>
                <li>• Block third-party cookies only</li>
                <li>• Clear cookies when you close the browser</li>
                <li>• Create exceptions for specific websites</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Opt-Out Tools</h3>
              <p className="text-gray-300 text-sm mb-4">
                You can also use industry opt-out tools:
              </p>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <a href="http://www.aboutads.info/choices/" className="text-[#00ffff] hover:text-[#2afdfd] break-words">Digital Advertising Alliance</a></li>
                <li>• <a href="http://www.networkadvertising.org/choices/" className="text-[#00ffff] hover:text-[#2afdfd] break-words">Network Advertising Initiative</a></li>
                <li>• <a href="http://www.youronlinechoices.eu/" className="text-[#00ffff] hover:text-[#2afdfd] break-words">Your Online Choices (EU)</a></li>
              </ul>
              <button 
                onClick={clearAllCookies}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 mt-4 flex items-center w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Cookies
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-[#00ffff]/10 to-[#2afdfd]/10 border border-[#00ffff]/30 rounded-xl p-6 mt-8"
        >
          <h3 className="font-semibold text-[#00ffff] mb-2">Questions About Cookies?</h3>
          <p className="text-gray-300 text-sm">
            If you have questions about our use of cookies or this policy, please contact us at{' '}
            <a href="mailto:privacy@ownshopy.com" className="font-semibold underline text-[#00ffff]">privacy@ownshopy.com</a>.
            We&apos;ll be happy to help you understand how we use cookies and assist with any privacy concerns.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
