import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Printer,
  Share2,
  CheckCircle,
  User,
  Package,
  Shield,
  FileText,
  X,
  Copy,
  Check
} from 'lucide-react';

// Types
interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PaymentReceiptProps {
  receiptId: string;
  sessionId: string;
  escrowId: string;
  date: string;
  payer: {
    name: string;
    afroId: string;
    village: string;
  };
  beneficiary: {
    name: string;
    afroId: string;
    village: string;
  };
  service: {
    name: string;
    category: string;
  };
  lineItems?: LineItem[];
  subtotal: number;
  platformFee: number;
  total: number;
  paymentMethod: 'escrow' | 'direct' | 'wtp';
  status: 'paid' | 'refunded' | 'partial_refund';
  completedAt: string;
  notes?: string;
  onClose: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  receiptId,
  sessionId,
  escrowId,
  date,
  payer,
  beneficiary,
  service,
  lineItems,
  subtotal,
  platformFee,
  total,
  paymentMethod,
  status,
  completedAt,
  notes,
  onClose
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    // For now, we'll trigger the print dialog
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${receiptId}`,
          text: `Payment receipt for ${service.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`Receipt ID: ${receiptId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      escrow: 'Escrow Payment',
      direct: 'Direct Payment',
      wtp: 'Wari Transaction Protocol'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getStatusInfo = (currentStatus: string) => {
    const statusMap = {
      paid: { label: 'Paid', color: 'green', icon: CheckCircle },
      refunded: { label: 'Refunded', color: 'red', icon: CheckCircle },
      partial_refund: { label: 'Partially Refunded', color: 'yellow', icon: CheckCircle }
    };
    return statusMap[currentStatus as keyof typeof statusMap] || statusMap.paid;
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
      >
        {/* Header - Non-printable controls */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white rounded-t-2xl print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Payment Receipt</h2>
              <p className="text-sm text-indigo-100 mt-1">
                Receipt #{receiptId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Receipt Content - Printable */}
        <div ref={receiptRef} className="p-8 print:p-12">
          {/* Header - Printable */}
          <div className="text-center mb-8 print:mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center print:w-16 print:h-16">
                <FileText className="w-6 h-6 text-white print:w-8 print:h-8" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900 print:text-3xl">VIEWDICON</h1>
                <p className="text-sm text-gray-600">African Professional Network</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 print:text-4xl">PAYMENT RECEIPT</h2>
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${statusInfo.color}-100 rounded-full`}>
              <StatusIcon className={`w-5 h-5 text-${statusInfo.color}-600`} />
              <span className={`font-semibold text-${statusInfo.color}-700`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 print:mb-12">
            {/* Receipt Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Receipt ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{receiptId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Session ID</p>
                <p className="font-mono text-sm text-gray-700">{sessionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Escrow ID</p>
                <p className="font-mono text-sm text-gray-700">{escrowId}</p>
              </div>
            </div>

            {/* Date Info */}
            <div className="space-y-3 text-right">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Issue Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(date).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Completed</p>
                <p className="text-sm text-gray-700">
                  {new Date(completedAt).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Payment Method</p>
                <p className="text-sm text-gray-700">{getPaymentMethodLabel(paymentMethod)}</p>
              </div>
            </div>
          </div>

          {/* Parties Information */}
          <div className="grid grid-cols-2 gap-6 mb-8 print:mb-12">
            {/* From (Payer) */}
            <div className="border-2 border-gray-200 rounded-xl p-4 print:p-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900 uppercase text-sm">From (Client)</h3>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{payer.name}</p>
                <p className="text-sm text-gray-600">{payer.village} Village</p>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Afro-ID</p>
                  <p className="font-mono text-sm text-gray-700">{payer.afroId}</p>
                </div>
              </div>
            </div>

            {/* To (Beneficiary) */}
            <div className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 print:p-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-indigo-900 uppercase text-sm">To (Professional)</h3>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{beneficiary.name}</p>
                <p className="text-sm text-gray-600">{beneficiary.village} Village</p>
                <div className="pt-2 border-t border-indigo-200">
                  <p className="text-xs text-gray-500">Afro-ID</p>
                  <p className="font-mono text-sm text-gray-700">{beneficiary.afroId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 print:mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900 uppercase text-sm">Service Description</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">{service.name}</p>
            <p className="text-sm text-gray-600">{service.category}</p>
          </div>

          {/* Line Items (if provided) */}
          {lineItems && lineItems.length > 0 && (
            <div className="mb-8 print:mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-bold text-gray-900 uppercase">Description</th>
                    <th className="text-center py-3 text-sm font-bold text-gray-900 uppercase">Qty</th>
                    <th className="text-right py-3 text-sm font-bold text-gray-900 uppercase">Unit Price</th>
                    <th className="text-right py-3 text-sm font-bold text-gray-900 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="py-3 text-sm text-gray-700 text-center">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-700 text-right">₦{item.unitPrice.toLocaleString()}</td>
                      <td className="py-3 text-sm font-semibold text-gray-900 text-right">₦{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t-2 border-gray-300 pt-6 mb-8 print:mb-12">
            <div className="max-w-sm ml-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Platform Fee (5%)</span>
                <span className="font-semibold text-gray-900">₦{platformFee.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-indigo-600">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 print:mb-12">
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Notes</p>
                  <p className="text-sm text-yellow-800">{notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Security & Verification */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <Shield className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">Verified Transaction</p>
                <p className="text-sm text-green-800">
                  This receipt is digitally verified and secured through Viewdicon's escrow system. 
                  All transactions are protected and can be audited for authenticity.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center print:mt-12">
            <p className="text-sm text-gray-600 mb-2">
              Thank you for using Viewdicon - Building Trust in African Business
            </p>
            <p className="text-xs text-gray-500">
              This is an official receipt generated by Viewdicon Platform
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For support, contact: support@viewdicon.com
            </p>
            
            {/* QR Code Placeholder */}
            <div className="mt-6 flex justify-center print:mt-8">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scan to verify receipt authenticity
            </p>
          </div>
        </div>

        {/* Bottom Actions - Non-printable */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl print:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Receipt ID
                </>
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          ${receiptRef.current ? `
            #${receiptRef.current.id},
            #${receiptRef.current.id} * {
              visibility: visible;
            }
            #${receiptRef.current.id} {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          ` : ''}
        }
      `}</style>
    </div>
  );
};

export default PaymentReceipt;