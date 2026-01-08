import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GeneratorFleet } from './components/GeneratorFleet';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <GeneratorFleet />
        <WhyChooseUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
