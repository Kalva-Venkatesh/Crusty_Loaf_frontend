import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Card from '../components/common/Card';

// Placeholder data for chefs
const chefs = [
  {
    name: 'Juliette Blanc',
    role: 'Head Pâtissier',
    bio: 'With over 20 years of experience in Parisian bakeries, Juliette brings authentic French pastry techniques to every croissant and éclair.',
    img: 'https://images.unsplash.com/photo-1577219491135-ce399e3a3525?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Marcus Cole',
    role: 'Head Baker',
    bio: 'Marcus is the heart of our sourdough program, nurturing his starters with passion and precision to create the perfect rustic loaf.',
    img: 'https://images.unsplash.com/photo-1620732899478-803ed2acf3e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
];

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Our Story Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 font-serif mb-4">
              Our Story
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Founded in 2020, The Crusty Loaf began as a simple dream: to bring the art of traditional, slow-fermented baking to our community. We believe that good bread takes time, and great bread brings people together.
            </p>
            <p className="text-lg text-gray-700">
              From our first sourdough starter to our bustling bakery today, our mission has remained the same: use the best local ingredients, bake with passion, and serve with a smile. We're not just a bakery; we're a part of your daily ritual.
            </p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1533782536553-3538f9b2d0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Inside of The Crusty Loaf bakery" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Meet the Chefs Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 font-serif text-center mb-8">
          Meet Our Bakers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {chefs.map((chef) => (
            <Card key={chef.name} className="flex flex-col sm:flex-row items-center gap-6 p-6">
              <img 
                src={chef.img} 
                alt={chef.name} 
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{chef.name}</h3>
                <p className="text-md font-bold text-amber-800 mb-2">{chef.role}</p>
                <p className="text-gray-600">{chef.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Follow Us Section */}
      <section>
        <h2 className="text-3xl font-bold text-amber-900 font-serif text-center mb-8">
          Find Us On Social Media
        </h2>
        <div className="flex justify-center space-x-8">
          <a href="#" className="flex flex-col items-center text-gray-700 hover:text-amber-800 transition-colors">
            <Instagram size={40} />
            <span className="mt-2">@TheCrustyLoaf</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-700 hover:text-amber-800 transition-colors">
            <Facebook size={40} />
            <span className="mt-2">/TheCrustyLoaf</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-700 hover:text-amber-800 transition-colors">
            <Twitter size={40} />
            <span className="mt-2">@CrustyLoafBakery</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;