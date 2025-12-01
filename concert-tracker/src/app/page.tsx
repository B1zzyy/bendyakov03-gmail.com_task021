'use client'

import { useState, useEffect } from 'react';
import { FaDollarSign } from 'react-icons/fa';

type Concert = {
  artist: string;
  venue: string;
  date: string; // Store date as ISO string
  price: number | null;
  id: number;
};

export default function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [newConcert, setNewConcert] = useState<{
    artist: string;
    venue: string;
    date: string;
    price: number | null;
  }>({
    artist: '',
    venue: '',
    date: '',
    price: null,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const savedConcerts = localStorage.getItem('concerts');
    if (savedConcerts) {
      setConcerts(JSON.parse(savedConcerts) as Concert[]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConcert(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceSelect = (price: number) => {
    setNewConcert(prev => ({ ...prev, price }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcert.artist || !newConcert.venue || !newConcert.date || !newConcert.price) return;

    const concertDate = new Date(newConcert.date);

    const newConcertEntry: Concert = {
      ...newConcert,
      id: Date.now(),
    };

    const updatedConcerts = [...concerts, newConcertEntry];
    setConcerts(updatedConcerts);
    localStorage.setItem('concerts', JSON.stringify(updatedConcerts));
    setNewConcert({ artist: '', venue: '', date: '', price: null });
  };

  const sortedConcerts = [...concerts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Column - Form */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-2xl mb-4">Add Concert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="artist"
            placeholder="Artist Name"
            value={newConcert.artist}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={newConcert.venue}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={newConcert.date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaDollarSign
                key={value}
                className={`text-2xl cursor-pointer ${newConcert.price === value ? 'text-green-500' : 'text-gray-400'}`}
                onClick={() => handlePriceSelect(value)}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Add Concert
          </button>
        </form>
      </div>

      {/* Right Column - Concert List */}
      <div className="w-2/3 p-4 overflow-y-auto h-screen">
        <h2 className="text-2xl mb-4">Concerts</h2>
        <div className="space-y-4">
          {sortedConcerts.map((concert) => {
            const concertDate = new Date(concert.date);
            const attended = concertDate < today;
            
            return (
            <div key={concert.id} className="p-4 bg-white shadow rounded">
              <div className="flex justify-between items-center">
                <h3 className="text-xl">{concert.artist}</h3>
                <span className="text-sm">{attended ? 'Attended' : 'Upcoming'}</span>
              </div>
              <p>{concert.venue}</p>
              <p>{concertDate.toLocaleDateString()}</p>
              {concert.price && (
              <div className="flex">
                {Array.from({ length: concert.price }, () => (
                  <FaDollarSign key={Math.random()} className="text-xl" />
                ))}
              </div>
              )}
              <hr className="my-2 border-t" />
            </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
