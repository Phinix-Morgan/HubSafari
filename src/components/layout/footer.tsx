import { ChefHat, Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">HubSafari</span>
            </Link>
            <p className="max-w-md text-muted-foreground">
             From your morning coffee fix to your evening meal, we've got you covered. Enjoy handcrafted drinks, light bites, and a full menu of savory dishes, all served in a cozy and welcoming atmosphere.
            </p>
          </div>
          <div>
            <h3 className="font-bold font-headline text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>NH-154 dhelu, joginder nagar , 175015</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>9817866911</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@hubsafari.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-headline text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Open 24/7</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HubSafari. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
