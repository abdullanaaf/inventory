import React, { useState } from 'react';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Add your authentication logic here
    alert(`Logging in with:
User Name: ${userName}
Password: ${password ? '******' : ''}
Remember me: ${remember}`);
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-96 flex flex-col justify-center items-center bg-gray-50 bg-opacity-70 p-10 shadow-md z-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sage_logo_2019.svg/2560px-Sage_logo_2019.svg.png"
          alt="Sage logo"
          className="w-24 mb-2"
          loading="lazy"
        />
        <h2 className="text-gray-600 mb-8 uppercase font-light tracking-wide text-center">
          Enterprise Management
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="User name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="w-4 h-4"
            />
            Remember me on this computer
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Sign in
          </button>
        </form>
      </div>

      <div
        className="flex-1 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80')"
        }}
        aria-hidden="true"
      />
    </div>
  );
}
