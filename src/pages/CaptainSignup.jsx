import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import { SocketContext } from '../context/SocketContext';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const socket = useContext(SocketContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleCapacity: '',
    vehicleType: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullname: { firstname: formData.firstName, lastname: formData.lastName },
        email: formData.email,
        password: formData.password,
        vehicle: {
          color: formData.vehicleColor,
          plate: formData.vehiclePlate,
          capacity: formData.vehicleCapacity,
          vehicleType: formData.vehicleType
        }
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);

        // Join the socket room for the captain
        if (socket?.connected) {
          socket.emit('join', { userId: data.captain._id, userType: 'captain' });
        }

        navigate('/captain-home');
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        vehicleColor: '',
        vehiclePlate: '',
        vehicleCapacity: '',
        vehicleType: ''
      });

    } catch (err) {
      console.error('Signup error:', err);
      alert(err.response?.data?.message || 'Failed to signup');
    }
  };

  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-3"
          src="https://cdn.brandfetch.io/iduqsBf89y/w/820/h/295/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
          alt="Logo"
        />

        <form onSubmit={submitHandler} className="space-y-6">

          {/* Name */}
          <div>
            <h3 className="text-lg font-medium mb-2">What&apos;s our Captain&apos;s name</h3>
            <div className="flex gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-lg font-medium mb-2">What&apos;s our Captain&apos;s email</h3>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              placeholder="email@example.com"
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg"
            />
          </div>

          {/* Password */}
          <div>
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              placeholder="password"
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg"
            />
          </div>

          {/* Vehicle Info */}
          <div>
            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
            <div className="flex gap-4 mb-4">
              <input
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                required
                placeholder="Vehicle Color"
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              />
              <input
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                required
                placeholder="Vehicle Plate"
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              />
            </div>
            <div className="flex gap-4">
              <input
                name="vehicleCapacity"
                value={formData.vehicleCapacity}
                onChange={handleChange}
                type="number"
                required
                placeholder="Vehicle Capacity"
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              />
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg"
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>
          </div>

          <button className="bg-[#111] text-white font-semibold rounded-lg px-4 py-2 w-full text-lg">
            Create Captain Account
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/captain-login" className="text-blue-600">Login here</Link>
        </p>
      </div>

      <p className="text-[10px] mt-6 leading-tight">
        This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service apply</span>.
      </p>
    </div>
  );
};

export default CaptainSignup;
