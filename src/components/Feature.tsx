import React from 'react';
import Image from 'next/image';

type FeatureCardProps = {
  title: string;
  description: string;
  image: string;
};

function Feature() {
  const data = [
    {
      title: "Secure Messaging",
      description: "End-to-end encryption for your privacy",
      image: "/images/feature1.png",
    },
    {
      title: "Anonymous Connections",
      description: "Connect without revealing your identity",
      image: "/images/feature2.png",
    },
    {
      title: "Instant Updates",
      description: "Real-time messaging and notifications",
      image: "/images/feature3.png",
    },
  ];

  const FeatureCard = ({ title, description, image }: FeatureCardProps) => {
    return (
      <div className="text-center rounded-xl shadow-xl py-10 px-6 md:px-8 lg:px-10 bg-white transition-transform duration-300 hover:scale-105">
        <Image src={image} alt={title} width={60} height={60} className="mb-5 mx-auto" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="bg-white px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
      {data.map((item, index) => (
        <FeatureCard
          key={index}
          title={item.title}
          description={item.description}
          image={item.image}
        />
      ))}
    </div>
  );
}

export default Feature;
