
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat, Heart, Leaf } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Marco Chen', role: 'Head Chef', avatar: 'https://placehold.co/100x100.png', dataAiHint: "male chef" },
    { name: 'Isabella Rodriguez', role: 'Pastry Chef', avatar: 'https://placehold.co/100x100.png', dataAiHint: "female chef" },
    { name: 'John Doe', role: 'Founder', avatar: 'https://placehold.co/100x100.png', dataAiHint: "restaurant owner" },
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'We partner with local farmers to source the freshest, highest-quality ingredients for every dish.',
    },
    {
      icon: Heart,
      title: 'Made with Passion',
      description: 'Our kitchen is fueled by a passion for creating memorable culinary experiences for our guests.',
    },
    {
      icon: ChefHat,
      title: 'Culinary Expertise',
      description: 'Our experienced chefs blend traditional techniques with modern innovation to create unique flavors.',
    },
  ];

  return (
    <div className="bg-background">
      <div className="container py-12 md:py-20">
        
        {/* Masthead */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-headline mb-4">Our Culinary Journey</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Crafting unforgettable dining experiences since 2010.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-headline text-primary mb-4">From a Dream to Your Table</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Flavors Express began with a simple idea: to create a place where people could enjoy exceptional food in a warm and inviting atmosphere. Our founder, John Doe, traveled the world, gathering inspiration from diverse culinary traditions.
              </p>
              <p>
                He returned with a vision to fuse these global flavors with the best local produce. Today, our restaurant stands as a testament to that vision—a place where every meal tells a story of passion, quality, and community.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] relative rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/600x450.png" 
              data-ai-hint="busy kitchen" 
              alt="The bustling kitchen at Flavors Express with chefs at work" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        {/* Our Values Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-headline mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-headline mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-headline mb-12">Meet Our Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
