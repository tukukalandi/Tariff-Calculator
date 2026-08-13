/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Calculator, Receipt, Package, Truck, 
  MapPin, User, Shield, CreditCard, 
  Info 
} from 'lucide-react';
import { 
  calculateTariff, 
  ServiceCategory, 
  CustomerType, 
  ZONES_DOC, 
  ZONES_PARCEL, 
  TariffParams
} from './data/tariffs';

export default function App() {
  const [params, setParams] = useState<TariffParams>({
    category: 'SPEED_POST_DOC',
    customerType: 'RETAIL',
    weight: 50,
    zone: 'local',
    hasRegistration: false,
    hasOtp: false,
    hasProofOfDelivery: false,
    codValue: null,
    insuranceValue: null,
    studentDiscount: false,
    contractualDiscountPercent: 0,
  });

  const zones = params.category === 'SPEED_POST_DOC' ? ZONES_DOC : ZONES_PARCEL;
  
  // Enforce zone reset on category change if zone doesn't exist
  const handleCategoryChange = (cat: ServiceCategory) => {
    const newZones = cat === 'SPEED_POST_DOC' ? ZONES_DOC : ZONES_PARCEL;
    const zoneExists = newZones.some(z => z.id === params.zone);
    setParams(p => ({
      ...p,
      category: cat,
      zone: zoneExists ? p.zone : 'local',
      hasProofOfDelivery: cat === 'SPEED_POST_DOC' ? p.hasProofOfDelivery : false,
      insuranceValue: cat !== 'SPEED_POST_DOC' ? p.insuranceValue : null,
    }));
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    setParams(p => ({
      ...p,
      customerType: type,
      studentDiscount: type === 'RETAIL' ? p.studentDiscount : false,
      contractualDiscountPercent: type === 'CONTRACTUAL' ? p.contractualDiscountPercent : 0,
      codValue: type === 'CONTRACTUAL' ? p.codValue : null,
      insuranceValue: type === 'CONTRACTUAL' ? p.insuranceValue : null,
    }));
  };

  const result = calculateTariff(params);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-xl shadow-inner">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">India Post Tariff Calculator</h1>
            <p className="text-xs text-neutral-500 font-medium">Prepared by Kalandi Charan Sahoo, PA, Dhenkanal RS SO</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Configuration Section */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Service & Customer Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-600" />
                  Service Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Service Category</label>
                  <div className="space-y-2">
                    {[
                      { id: 'SPEED_POST_DOC', label: 'Speed Post Document' },
                      { id: 'SPEED_POST_PARCEL', label: 'Speed Post Parcel' },
                      { id: 'INDIA_POST_PARCEL', label: 'India Post Parcel' }
                    ].map(cat => (
                      <label key={cat.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${params.category === cat.id ? 'border-red-600 bg-red-50/50' : 'border-neutral-200 hover:border-red-200 hover:bg-neutral-50'}`}>
                        <input 
                          type="radio" 
                          name="category" 
                          value={cat.id}
                          checked={params.category === cat.id}
                          onChange={() => handleCategoryChange(cat.id as ServiceCategory)}
                          className="text-red-600 focus:ring-red-500 w-4 h-4"
                        />
                        <span className={`text-sm font-medium ${params.category === cat.id ? 'text-red-900' : 'text-neutral-700'}`}>{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer Type</label>
                    <div className="flex bg-neutral-100 p-1 rounded-lg">
                      <button
                        onClick={() => handleCustomerTypeChange('RETAIL')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 sm:py-2 text-sm font-medium rounded-md transition-all ${params.customerType === 'RETAIL' ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        <User className="w-4 h-4" /> Retail
                      </button>
                      <button
                        onClick={() => handleCustomerTypeChange('CONTRACTUAL')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 sm:py-2 text-sm font-medium rounded-md transition-all ${params.customerType === 'CONTRACTUAL' ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        <Receipt className="w-4 h-4" /> Contractual
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Weight (Grams)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1"
                        value={params.weight || ''}
                        onChange={(e) => setParams({...params, weight: parseInt(e.target.value) || 0})}
                        className="block w-full pl-4 pr-12 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-base sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                        placeholder="e.g. 250"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium pointer-events-none">gm</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Distance / Zone</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select 
                        value={params.zone}
                        onChange={(e) => setParams({...params, zone: e.target.value})}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-base sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow appearance-none"
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Added Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  Value Added Services
                </h2>
                <span className="text-xs text-neutral-400">Optional</span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Available for Speed Post */}
                {(params.category === 'SPEED_POST_DOC' || params.category === 'SPEED_POST_PARCEL') && (
                  <>
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={params.hasRegistration}
                        onChange={(e) => setParams({...params, hasRegistration: e.target.checked})}
                        className="mt-1 text-red-600 focus:ring-red-500 w-4 h-4 rounded border-neutral-300"
                      />
                      <div>
                        <span className="block text-sm font-medium text-neutral-800">Registration</span>
                        <span className="block text-xs text-neutral-500 mt-0.5">Delivery to authorized person (Rs. 5)</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={params.hasOtp}
                        onChange={(e) => setParams({...params, hasOtp: e.target.checked})}
                        className="mt-1 text-red-600 focus:ring-red-500 w-4 h-4 rounded border-neutral-300"
                      />
                      <div>
                        <span className="block text-sm font-medium text-neutral-800">OTP Delivery</span>
                        <span className="block text-xs text-neutral-500 mt-0.5">Secure delivery via OTP ({params.customerType === 'RETAIL' ? 'Rs. 5' : 'Rs. 1.5'})</span>
                      </div>
                    </label>
                  </>
                )}

                {/* Available for Speed Post Doc */}
                {params.category === 'SPEED_POST_DOC' && (
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={params.hasProofOfDelivery}
                      onChange={(e) => setParams({...params, hasProofOfDelivery: e.target.checked})}
                      className="mt-1 text-red-600 focus:ring-red-500 w-4 h-4 rounded border-neutral-300"
                    />
                    <div>
                      <span className="block text-sm font-medium text-neutral-800">Proof of Delivery</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">Acknowledgment of receipt (Rs. 10)</span>
                    </div>
                  </label>
                )}

                {/* Contractual Services */}
                {params.customerType === 'CONTRACTUAL' && (
                  <>
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-4 border-t border-neutral-100">
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> Cash on Delivery Value
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                          <input 
                            type="number"
                            value={params.codValue === null ? '' : params.codValue}
                            onChange={(e) => setParams({...params, codValue: e.target.value ? parseFloat(e.target.value) : null})}
                            className="block w-full pl-8 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-base sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                            placeholder="Leave empty if N/A"
                          />
                        </div>
                      </div>

                      {params.category !== 'SPEED_POST_DOC' && (
                        <div>
                          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Insured Value
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                            <input 
                              type="number"
                              value={params.insuranceValue === null ? '' : params.insuranceValue}
                              onChange={(e) => setParams({...params, insuranceValue: e.target.value ? parseFloat(e.target.value) : null})}
                              className="block w-full pl-8 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-base sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                              placeholder="Leave empty if N/A"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {params.customerType !== 'CONTRACTUAL' && params.category !== 'SPEED_POST_DOC' && params.category !== 'SPEED_POST_PARCEL' && (
                  <div className="sm:col-span-2 py-4 flex items-center justify-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                    No value added services available for Retail India Post Parcel.
                  </div>
                )}
              </div>
            </div>

            {/* Discounts */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-600" />
                  Discounts
                </h2>
              </div>
              <div className="p-6">
                {params.customerType === 'RETAIL' && (params.category === 'SPEED_POST_DOC' || params.category === 'SPEED_POST_PARCEL') ? (
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-neutral-50 cursor-pointer transition-colors max-w-md">
                    <input 
                      type="checkbox"
                      checked={params.studentDiscount}
                      onChange={(e) => setParams({...params, studentDiscount: e.target.checked})}
                      className="mt-1 text-red-600 focus:ring-red-500 w-4 h-4 rounded border-neutral-300"
                    />
                    <div>
                      <span className="block text-sm font-medium text-neutral-800">Student Discount (10%)</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">Requires valid student ID from recognized institute.</span>
                    </div>
                  </label>
                ) : params.customerType === 'CONTRACTUAL' ? (
                  <div className="max-w-xs space-y-3">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Volume Discount (%)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={params.contractualDiscountPercent || ''}
                        onChange={(e) => setParams({...params, contractualDiscountPercent: parseFloat(e.target.value) || 0})}
                        className="block w-full pl-4 pr-12 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-base sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                        placeholder="e.g. 10"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium pointer-events-none">%</span>
                    </div>
                    <p className="text-xs text-neutral-400 flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      Based on monthly revenue and NTD/TD tiers. Add +1% for advance deposit, +2% for &gt;25 lakh revenue.
                    </p>
                  </div>
                ) : (
                  <div className="py-2 text-xs text-neutral-400">
                    No discounts applicable for this selection.
                  </div>
                )}
              </div>
            </div>

          </section>

          {/* Result Panel */}
          <section className="lg:col-span-4 relative">
            <div className="bg-neutral-900 rounded-3xl shadow-xl border border-neutral-800 overflow-hidden sticky top-24 text-white">
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                <h2 className="text-sm font-bold tracking-wide uppercase text-neutral-400 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Tariff Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-neutral-400">Base Tariff</span>
                  <span className="text-xl font-semibold tracking-tight">₹{result.baseTariff.toFixed(2)}</span>
                </div>
                
                {result.vas.total > 0 && (
                  <div className="space-y-2 border-t border-neutral-800 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 block">Value Added Services</span>
                    
                    {result.vas.registration > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 pl-2 border-l-2 border-red-500/30">Registration</span>
                        <span className="font-medium">₹{result.vas.registration.toFixed(2)}</span>
                      </div>
                    )}
                    {result.vas.otp > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 pl-2 border-l-2 border-red-500/30">OTP Delivery</span>
                        <span className="font-medium">₹{result.vas.otp.toFixed(2)}</span>
                      </div>
                    )}
                    {result.vas.proofOfDelivery > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 pl-2 border-l-2 border-red-500/30">Proof of Delivery</span>
                        <span className="font-medium">₹{result.vas.proofOfDelivery.toFixed(2)}</span>
                      </div>
                    )}
                    {result.vas.cod > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 pl-2 border-l-2 border-red-500/30">COD Fee</span>
                        <span className="font-medium">₹{result.vas.cod.toFixed(2)}</span>
                      </div>
                    )}
                    {result.vas.insurance > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 pl-2 border-l-2 border-red-500/30">Insurance Fee</span>
                        <span className="font-medium">₹{result.vas.insurance.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}

                {result.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm border-t border-neutral-800 pt-4">
                    <span className="text-amber-500 font-medium">Discount applied</span>
                    <span className="text-amber-500 font-medium">-₹{result.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-800 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Subtotal</span>
                    <span className="font-medium text-neutral-200">₹{result.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">GST (18%)</span>
                    <span className="font-medium text-neutral-200">₹{result.gst.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-neutral-950 border-t border-neutral-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Total Payable</span>
                  <span className="text-4xl font-bold tracking-tighter text-amber-400">₹{result.totalPayable.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Truck className="w-4 h-4 text-neutral-500" />
                  <p className="text-[10px] leading-relaxed text-neutral-500">
                    Tariffs are exclusive of taxes as notified by the Central Government. 
                    Calculations follow India Post official guidelines.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-2">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-0.5">Total Payable</span>
            <span className="text-xs text-neutral-500 font-medium">Incl. 18% GST</span>
          </div>
          <span className="text-3xl font-bold tracking-tighter text-amber-400">₹{result.totalPayable.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

