import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  School,
  FileText,
  Calendar,
  Wallet,
  ShieldCheck
} from 'lucide-react';

export default function FeeReceiptModal({
  student,
  activeSchool,
  paymentDetails,
  onClose
}) {
  if (!student) return null;

  const totalFee = Number(student.feeAmount) || 36000;
  const paidFee = Number(student.feePaid) || 0;
  const balanceDue = Math.max(0, totalFee - paidFee);

  const receiptNo = paymentDetails?.receiptNo || `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const paymentDate = paymentDetails?.date || new Date().toISOString().split('T')[0];
  const paymentMode = paymentDetails?.mode || 'Cash / Online UPI';
  const paymentAmount = paymentDetails?.amount || paidFee;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs modal-overlay overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto border border-slate-200 printable-card">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-700">Official Computerized Fee Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt (रसीद प्रिंट करें)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="border-2 border-slate-800 rounded-2xl p-6 sm:p-7 relative bg-white space-y-5">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <div className="flex items-center justify-center gap-3 mb-1">
              {activeSchool?.logoUrl ? (
                <div className="w-12 h-12 rounded-xl bg-white p-0.5 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  <img src={activeSchool.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center font-bold">
                  <School className="w-6 h-6" />
                </div>
              )}
              <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">
                {activeSchool?.name || "St. Xavier's Academy"}
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {activeSchool?.affiliation || "Affiliated to CBSE, New Delhi"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {activeSchool?.address || "School Campus, Main Road"} • Tel: {activeSchool?.phone || "+91 74549 96566"}
            </p>
            <div className="mt-2 inline-block px-4 py-0.5 bg-slate-900 text-white text-[11px] font-black uppercase rounded-full tracking-widest">
              OFFICIAL FEE PAYMENT RECEIPT (शुल्क भुगतान रसीद)
            </div>
          </div>

          {/* Receipt Info & Student Details */}
          <div className="grid grid-cols-2 gap-4 text-xs py-1 border-b border-slate-200">
            <div>
              <p><span className="text-slate-500">Receipt No:</span> <strong className="font-mono text-slate-900">{receiptNo}</strong></p>
              <p className="mt-1"><span className="text-slate-500">Payment Date:</span> <strong>{paymentDate}</strong></p>
              <p className="mt-1"><span className="text-slate-500">Academic Session:</span> <strong>{activeSchool?.session || '2026-2027'}</strong></p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">Admission No:</span> <strong className="font-mono text-slate-900">{student.admissionNo}</strong></p>
              <p className="mt-1"><span className="text-slate-500">Class & Section:</span> <strong>{student.className} - {student.section}</strong></p>
              <p className="mt-1"><span className="text-slate-500">Roll No:</span> <strong>{student.rollNo}</strong></p>
            </div>
          </div>

          {/* Student & Parent Info */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-black text-slate-900 text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Father's Name</span>
              <span className="font-bold text-slate-800">{student.fatherName || 'Guardian'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact No</span>
              <span className="font-bold text-slate-800 font-mono">{student.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="font-bold text-slate-800">{paymentMode}</span>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div className="overflow-hidden rounded-xl border border-slate-300">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3">S.No</th>
                  <th className="py-2.5 px-3">Fee Particulars (विवरण)</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 text-slate-500">1</td>
                  <td className="py-2 px-3 font-medium">Annual Tuition Fee (वार्षिक शिक्षण शुल्क)</td>
                  <td className="py-2 px-3 text-right font-mono">₹{(totalFee * 0.8).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-500">2</td>
                  <td className="py-2 px-3 font-medium">Exam & Laboratory Charges (परीक्षा व लैब शुल्क)</td>
                  <td className="py-2 px-3 text-right font-mono">₹{(totalFee * 0.1).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-500">3</td>
                  <td className="py-2 px-3 font-medium">Development & Computer Lab (विकास शुल्क)</td>
                  <td className="py-2 px-3 text-right font-mono">₹{(totalFee * 0.1).toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <td colSpan="2" className="py-2 px-3 text-slate-800">Total Annual School Fee (कुल देय शुल्क):</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-900">₹{totalFee.toLocaleString()}</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-950 font-black">
                  <td colSpan="2" className="py-2 px-3">Amount Deposited / Received (जमा की गई राशि):</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-800 text-sm">₹{paidFee.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan="2" className="py-2 px-3 text-slate-700">Remaining Balance Due (शेष बकाया):</td>
                  <td className={`py-2 px-3 text-right font-mono ${balanceDue === 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    ₹{balanceDue.toLocaleString()} {balanceDue === 0 ? '(All Clear)' : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fee Status: {student.feeStatus || (balanceDue === 0 ? 'Paid' : 'Partial')}</span>
            </span>
            <span>Computer generated official document • Signature not legally required</span>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 pt-8 text-center text-xs text-slate-700">
            <div>
              <div className="border-t border-slate-400 w-36 mx-auto pt-1 font-bold">
                Parent / Student Sign
              </div>
            </div>
            <div>
              <div className="border-t border-slate-400 w-40 mx-auto pt-1 font-bold">
                Cashier / Principal Seal
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}