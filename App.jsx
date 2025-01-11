import React, { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { loadStripe } from '@stripe/stripe-js';

// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your_publishable_key');

const products = [
  { id: 1, name: 'Panel Solar 400W Mono', price: 299.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Panel Solar 450W Poly', price: 349.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Panel Solar 500W Bifacial', price: 449.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Inverter 3kW', price: 599.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Inverter 5kW', price: 799.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Bateria Litium 5kWh', price: 2499.99, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
];

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
    toast.success('Produkti u shtua në shportë!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item, index) => index !== productId));
    toast.success('Produkti u hoq nga shporta!');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const stripe = await stripePromise;
      
      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      }));

      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast.error('Ndodhi një gabim. Ju lutem provoni përsëri.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ndodhi një gabim. Ju lutem provoni përsëri.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_CONTACT_TEMPLATE_ID',
        contactForm
      );
      toast.success('Mesazhi u dërgua me sukses!');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Ndodhi një gabim. Ju lutem provoni përsëri.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panele Solare</h1>
            <div className="flex items-center space-x-8">
              <button onClick={() => scrollToSection('rreth')} className="text-gray-600 hover:text-gray-900">Rreth Nesh</button>
              <button onClick={() => scrollToSection('produktet')} className="text-gray-600 hover:text-gray-900">Produktet</button>
              <button onClick={() => scrollToSection('sherbimet')} className="text-gray-600 hover:text-gray-900">Shërbimet</button>
              <button onClick={() => scrollToSection('kontakti')} className="text-gray-600 hover:text-gray-900">Kontakti</button>
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* About Section */}
        <section id="rreth" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Rreth Nesh</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Ne jemi një kompani e specializuar në instalimin dhe mirëmbajtjen e paneleve solare. 
                Me përvojë mbi 10 vjeçare në treg, ne ofrojmë zgjidhje të qëndrueshme energjetike për 
                shtëpitë dhe bizneset tuaja.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Misioni ynë është të ndihmojmë në kalimin drejt energjisë së pastër dhe të rinovueshme, 
                duke kontribuar në një të ardhme më të gjelbër për të gjithë.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produktet" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Produktet Tona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mt-2">{product.price.toFixed(2)}€</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Bli
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="sherbimet" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Shërbimet Tona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Instalimi</h3>
                <p className="text-gray-600">
                  Instalim profesional i paneleve solare me ekipin tonë të specializuar.
                  Përfshirë planifikimin, montimin dhe testimin e sistemit.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Mirëmbajtja</h3>
                <p className="text-gray-600">
                  Shërbime të rregullta mirëmbajtjeje për të siguruar performancë optimale
                  dhe jetëgjatësi maksimale të sistemit tuaj solar.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Konsulenca</h3>
                <p className="text-gray-600">
                  Këshillim profesional për zgjidhjen më të mirë për nevojat tuaja,
                  përfshirë analizën e konsumit dhe planifikimin e sistemit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontakti" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Na Kontaktoni</h2>
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Emri
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesazhi
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Dërgo Mesazhin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shporta</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500">Shporta është e zbrazët</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-600">{item.price.toFixed(2)}€</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hiq
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center font-bold mb-4">
                      <span>Totali:</span>
                      <span>{totalPrice.toFixed(2)}€</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                    >
                      {isProcessing ? 'Duke procesuar...' : 'Vazhdo me Pagesën'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;