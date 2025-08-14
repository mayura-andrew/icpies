import React, { useState, useEffect } from 'react';

interface FormData {
  paperId: string;
  title: string;
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  country: string;
  organization: string;
  participation: string;
  dates: string;
}

interface Props {
  onSubmit?: (data: FormData & { fee: string }) => void;
}

const RegistrationForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    paperId: '',
    title: '',
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    country: '',
    organization: '',
    participation: '',
    dates: ''
  });

  const [fee, setFee] = useState('');
  const [showFee, setShowFee] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Fee Calculator States
  const [calcCountry, setCalcCountry] = useState('');
  const [calcType, setCalcType] = useState('');
  const [calculatedFee, setCalculatedFee] = useState('');
  const [feeNote, setFeeNote] = useState('');
  const [showCalcResult, setShowCalcResult] = useState(false);

  // Calculate fee based on form data
  useEffect(() => {
    if (!formData.country || !formData.participation || !formData.dates) {
      setShowFee(false);
      return;
    }

    let calculatedFee = '';
    const isLocal = formData.country === 'LK';
    const isEarlyBird = new Date() < new Date('2025-09-05');

    if (isLocal) {
      if (isEarlyBird) {
        calculatedFee = 'LKR 3,500 (Early Bird)';
      } else {
        calculatedFee = 'LKR 5,000 (General Registration)';
      }
    } else {
      if (formData.participation === 'participant') {
        calculatedFee = 'USD 50 (Online Participation)';
      } else if (isEarlyBird) {
        calculatedFee = 'USD 100 (Early Bird)';
      } else {
        calculatedFee = 'USD 200 (General Registration)';
      }
    }

    setFee(calculatedFee);
    setShowFee(true);
  }, [formData.country, formData.participation, formData.dates]);

  // Fee Calculator Logic
  useEffect(() => {
    if (!calcCountry || !calcType) {
      setShowCalcResult(false);
      return;
    }

    let fee = '';
    let note = '';
    const isLocal = calcCountry === 'LK';
    const isEarlyBird = new Date() < new Date('2025-09-05');

    if (isLocal) {
      switch (calcType) {
        case 'early':
          fee = 'LKR 3,500';
          note = 'Early Bird Rate (Until September 5, 2025)';
          break;
        case 'student':
          fee = 'LKR 3,000';
          note = 'Student Rate (Valid student ID required)';
          break;
        case 'general':
          fee = 'LKR 5,000';
          note = 'General Registration Rate';
          break;
        default:
          fee = '';
          note = '';
      }
    } else {
      switch (calcType) {
        case 'early':
          fee = 'USD 100';
          note = `Early Bird Rate (Until September 5, 2025) ≈ LKR ${(100 * 305).toLocaleString()}`;
          break;
        case 'online':
          fee = 'USD 50';
          note = `Online Participation ≈ LKR ${(50 * 305).toLocaleString()}`;
          break;
        case 'general':
          fee = 'USD 200';
          note = `General Registration Rate ≈ LKR ${(200 * 305).toLocaleString()}`;
          break;
        case 'student':
          fee = 'Not Available';
          note = 'Student rates are only available for local participants';
          break;
        default:
          fee = '';
          note = '';
      }
    }

    if (fee && fee !== 'Not Available') {
      setCalculatedFee(fee);
      setFeeNote(note + ' (Bank service fees may apply)');
      setShowCalcResult(true);
    } else {
      setShowCalcResult(false);
    }
  }, [calcCountry, calcType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Phone number formatting
    if (name === 'phone') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.startsWith('94')) {
        formattedValue = '+' + formattedValue;
      } else if (formattedValue.startsWith('0')) {
        formattedValue = '+94 ' + formattedValue.substring(1);
      }
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCalcCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setCalcCountry(country);
    setCalcType(''); // Reset type when country changes
  };

  const handleCalcTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalcType(e.target.value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required field validation
    const requiredFields: (keyof FormData)[] = [
      'title', 'name', 'idNumber', 'phone', 'email',
      'country', 'organization', 'participation', 'dates'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submissionData = { ...formData, fee };
      onSubmit?.(submissionData);

      // Default action if no onSubmit provided
      if (!onSubmit) {
        alert('Registration data collected successfully! Redirecting to payment gateway...');
        console.log('Registration Data:', submissionData);
      }
    }
  };

  const countries = [
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'IN', label: 'India' },
    { value: 'MV', label: 'Maldives' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'CA', label: 'Canada' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'SG', label: 'Singapore' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'TH', label: 'Thailand' },
    { value: 'OTHER', label: 'Other' }
  ];

  const inputClassName = (fieldName: keyof FormData) => `
    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1A7A64] focus:border-transparent transition-colors
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
  `;

  // Get filtered calc type options based on selected country
  const getCalcTypeOptions = () => {
    const baseOptions = [
      { value: '', label: 'Select Type' },
      { value: 'general', label: 'General Registration' },
      { value: 'early', label: 'Early Bird' }
    ];

    if (calcCountry === 'LK') {
      return [
        ...baseOptions,
        { value: 'student', label: 'Student (Local only)' }
      ];
    } else if (calcCountry === 'OTHER') {
      return [
        ...baseOptions,
        { value: 'online', label: 'Online Participation (Foreign only)' }
      ];
    }

    return baseOptions;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-8 flex items-center">
        <svg className="w-6 h-6 text-[#1A7A64] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Conference Registration Application
      </h2>

      {/* Fee Calculator */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg mb-8">
        <h4 className="font-semibold text-[#2C3E50] mb-4">
          Calculate Your Registration Fee
        </h4>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Location
            </label>
            <select
              value={calcCountry}
              onChange={handleCalcCountryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A7A64] focus:border-transparent"
            >
              <option value="">Select Country</option>
              <option value="LK">Sri Lanka</option>
              <option value="OTHER">Other Countries</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participation Type
            </label>
            <select
              value={calcType}
              onChange={handleCalcTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A7A64] focus:border-transparent"
              disabled={!calcCountry}
            >
              {getCalcTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {showCalcResult && (
          <div className="p-4 bg-[#1A7A64]/10 rounded-lg border border-[#1A7A64]/20">
            <div className="text-lg font-bold text-[#1A7A64]">
              {calculatedFee}
            </div>
            <div className="text-sm text-gray-600 mt-1">{feeNote}</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paper Submission ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paper Submission ID <span className="text-gray-500">(if applicable)</span>
          </label>
          <input
            type="text"
            name="paperId"
            value={formData.paperId}
            onChange={handleInputChange}
            className={inputClassName('paperId')}
            placeholder="Enter your paper submission ID"
          />
        </div>

        {/* Title and Name */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={inputClassName('title')}
            >
              <option value="">Select Title</option>
              <option value="Rev.">Rev.</option>
              <option value="Prof.">Prof.</option>
              <option value="Dr.">Dr.</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name with Initials <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={inputClassName('name')}
              placeholder="e.g., A.B.C. Perera"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
        </div>

        {/* National ID/Passport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Card/Passport Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            className={inputClassName('idNumber')}
            placeholder="Enter your ID or Passport number"
          />
          {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telephone/Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClassName('phone')}
              placeholder="+94 11 111 1111"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClassName('email')}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={inputClassName('country')}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        {/* Affiliated Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Affiliated Organization / Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className={inputClassName('organization')}
            placeholder="Enter your organization or institution name"
          />
          {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
        </div>

        {/* Nature of Participation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Nature of Participation <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 'presenter', title: 'Presenter', description: 'Present a paper at the conference', color: '[#1A7A64]' },
              { value: 'participant', title: 'Participant Only', description: 'Attend without presenting', color: '[#0D3B66]' }
            ].map(option => (
              <label
                key={option.value}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.participation === option.value
                    ? `border-${option.color} bg-${option.color}/5`
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="participation"
                  value={option.value}
                  checked={formData.participation === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full mr-3 ${
                  formData.participation === option.value
                    ? `border-${option.color} bg-${option.color}`
                    : 'border-gray-300'
                } relative`}>
                  {formData.participation === option.value && (
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.participation && <p className="text-red-500 text-sm mt-1">{errors.participation}</p>}
        </div>

        {/* Participation Dates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Dates for Participating <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: 'day1', title: 'Day 1', date: '24th September 2025', color: '[#1A7A64]' },
              { value: 'day2', title: 'Day 2', date: '25th September 2025', color: '[#0D3B66]' },
              { value: 'both', title: 'Both Days', date: '24th & 25th September', color: '[#4ECDC4]' }
            ].map(option => (
              <label
                key={option.value}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.dates === option.value
                    ? `border-${option.color} bg-${option.color}/5`
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dates"
                  value={option.value}
                  checked={formData.dates === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full mr-3 ${
                  formData.dates === option.value
                    ? `border-${option.color} bg-${option.color}`
                    : 'border-gray-300'
                } relative`}>
                  {formData.dates === option.value && (
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.date}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}
        </div>

        {/* Registration Fee Display */}
        {showFee && (
          <div className="p-6 bg-gradient-to-r from-[#1A7A64]/10 to-[#4ECDC4]/10 rounded-lg border border-[#1A7A64]/20">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Registration Fee</h3>
            <div className="text-[#1A7A64] font-bold text-xl">{fee}</div>
            <p className="text-sm text-gray-600 mt-2">* Transaction convenience fees will be added during payment</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1A7A64] to-[#4ECDC4] text-white font-semibold py-4 px-6 rounded-lg hover:from-[#156954] hover:to-[#3bb8b0] transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
