import { Layout } from "@/components/layout/layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Invoice, InvoiceItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Loader2, Search, Trash2, Eye, ArrowUpDown, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, useRef } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import autoGammaLogo from "@assets/image_1769446487293.png";

const BUSINESS_INFO = {
  "Auto Gamma": {
    name: "Auto Gamma",
    address: "Shop no. 09 & 10, Shreeji Parasio, Prasad Hotel Road, near Panvel Highway, beside Tulsi Aangan Soc, Katrap, Badlapur, Maharashtra 421503",
    phone: "+91 77380 16768",
    email: "support@autogamma.in",
    website: "www.autogamma.in",
    logo: autoGammaLogo,
  },
  "AGNX": {
    name: "AGNX",
    address: "Shop no. 09 & 10, Shreeji Parasio, Prasad Hotel Road, near Panvel Highway, beside Tulsi Aangan Soc, Katrap, Badlapur, Maharashtra 421503",
    phone: "+91 77380 16768",
    email: "support@autogamma.in",
    website: "www.autogamma.in",
    logo: autoGammaLogo,
  }
};

function InvoiceItemDetails({ item }: { item: InvoiceItem }) {
  const hasSubDetails = item.warranty || item.category || item.rollUsed || item.vehicleType || item.technician;
  
  return (
    <div className="space-y-1">
      <div className="font-semibold text-slate-900">{item.name}</div>
      {hasSubDetails && (
        <div className="text-xs text-slate-500 space-y-0.5 pl-2 border-l-2 border-slate-200">
          {item.type === "PPF" && (
            <>
              {item.warranty && (
                <div><span className="font-medium text-slate-700">Warranty:</span> {item.warranty}</div>
              )}
              {item.rollUsed && item.rollUsed > 0 && (
                <div><span className="font-medium text-slate-700">Total Sq.ft Roll Used:</span> {item.rollUsed} sq.ft</div>
              )}
              {item.vehicleType && (
                <div><span className="font-medium text-slate-700">Vehicle Type:</span> {item.vehicleType}</div>
              )}
              {item.technician && (
                <div><span className="font-medium text-slate-700">Technician:</span> {item.technician}</div>
              )}
            </>
          )}
          {item.type === "Service" && (
            <>
              {item.vehicleType && (
                <div><span className="font-medium text-slate-700">Vehicle Type:</span> {item.vehicleType}</div>
              )}
              {item.technician && (
                <div><span className="font-medium text-slate-700">Technician:</span> {item.technician}</div>
              )}
            </>
          )}
          {item.type === "Accessory" && (
            <>
              {item.category && (
                <div><span className="font-medium text-slate-700">Category:</span> {item.category}</div>
              )}
              {item.quantity && item.quantity > 1 && (
                <div><span className="font-medium text-slate-700">Quantity:</span> {item.quantity}</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function PrintableInvoice({ invoice }: { invoice: Invoice }) {
  const businessInfo = BUSINESS_INFO[invoice.business];
  const gstPercentage = invoice.gstPercentage || 18;
  const halfGst = gstPercentage / 2;
  const discount = invoice.discount || 0;
  const laborItems = invoice.items.filter(i => i.type === "Labor");
  const nonLaborItems = invoice.items.filter(i => i.type !== "Labor");
  const laborTotal = laborItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  
  return (
    <div className="print-invoice bg-white p-8" id="printable-invoice">
      {/* Header with Logo, Business Info, and Invoice Details */}
      <div className="flex justify-between items-start border-b-2 border-red-600 pb-6 mb-6">
        {/* Left Side: Logo and Business Details */}
        <div className="space-y-3">
          <img src={businessInfo.logo} alt={businessInfo.name} className="h-16 object-contain" />
          <div className="text-sm text-slate-600 space-y-0.5 max-w-xs">
            <p><span className="font-semibold text-slate-700">ADDRESS:</span> {businessInfo.address}</p>
            <p><span className="font-semibold text-slate-700">CONTACT:</span> {businessInfo.phone}</p>
            <p><span className="font-semibold text-slate-700">MAIL:</span> {businessInfo.email}</p>
            <p><span className="font-semibold text-slate-700">WEBSITE:</span> {businessInfo.website}</p>
          </div>
        </div>
        
        {/* Right Side: Invoice Details */}
        <div className="text-right space-y-2">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Invoice Details</p>
          <p className="text-2xl font-bold text-slate-900">#{invoice.invoiceNo}</p>
          <p className="text-slate-600">{format(new Date(invoice.date || new Date()), "dd MMM yyyy, hh:mm a")}</p>
        </div>
      </div>


      {/* Bill To and Vehicle Details */}
      <div className="grid grid-cols-2 gap-8 mb-6 bg-slate-50 p-4 rounded-lg">
        <div className="space-y-2">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Bill To</p>
          <p className="text-xl font-bold text-slate-900">{invoice.customerName}</p>
          <p className="text-slate-600">{invoice.phoneNumber}</p>
          {invoice.emailAddress && <p className="text-slate-600">{invoice.emailAddress}</p>}
        </div>
        <div className="text-right space-y-2">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Vehicle Details</p>
          <div className="text-sm space-y-1">
            <p className="text-slate-600"><span className="font-semibold text-slate-700">Make / Model:</span> {invoice.vehicleMake || "-"} {invoice.vehicleModel || ""}</p>
            <p className="text-slate-600"><span className="font-semibold text-slate-700">Year:</span> {invoice.vehicleYear || "-"}</p>
            <p className="text-slate-600"><span className="font-semibold text-slate-700">License Plate:</span> {invoice.licensePlate || "-"}</p>
            {invoice.vehicleType && <p className="text-slate-600"><span className="font-semibold text-slate-700">Type:</span> {invoice.vehicleType}</p>}
          </div>
        </div>
      </div>

      {/* Service Items Table */}
      <div className="mb-6">
        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Service Items</p>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900 text-white">
              <TableHead className="text-white font-bold">Sr No.</TableHead>
              <TableHead className="text-white font-bold">Description</TableHead>
              <TableHead className="text-white font-bold">Type</TableHead>
              <TableHead className="text-right text-white font-bold">Rate</TableHead>
              <TableHead className="text-center text-white font-bold">Qty</TableHead>
              <TableHead className="text-right text-white font-bold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonLaborItems.map((item, idx) => (
              <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <TableCell className="font-medium text-slate-600">{idx + 1}</TableCell>
                <TableCell>
                  <InvoiceItemDetails item={item} />
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.type === "PPF" ? "destructive" : item.type === "Service" ? "default" : "secondary"} 
                    className={`text-[10px] uppercase ${item.type === "PPF" ? "bg-red-600" : ""}`}
                  >
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                <TableCell className="text-center">{item.quantity || 1}</TableCell>
                <TableCell className="text-right font-bold">
                  ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-2 bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
            <span className="font-medium">Base Amount</span>
            <span className="font-bold">₹{invoice.subtotal.toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600 pb-2 border-b border-slate-200">
              <span className="font-medium">Discount</span>
              <span className="font-bold">(-) ₹{discount.toLocaleString()}</span>
            </div>
          )}

          {laborTotal > 0 && (
            <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
              <span className="font-medium">Labor Charges</span>
              <span className="font-bold">₹{laborTotal.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
            <span className="font-medium">SubTotal</span>
            <span className="font-bold">₹{(invoice.subtotal - discount).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span className="font-medium">(+) SGST: {halfGst.toFixed(2)}%</span>
            <span className="font-bold">₹{(invoice.gstAmount / 2).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
            <span className="font-medium">(+) CGST: {halfGst.toFixed(2)}%</span>
            <span className="font-bold">₹{(invoice.gstAmount / 2).toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center pt-2 text-xl font-black text-red-600">
            <span className="uppercase tracking-tighter">Grand Total</span>
            <span>₹{invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          Please Note: Please be advised that the booking amount mentioned in this invoice is non-refundable. 
          This amount secures your reservation and cannot be returned in case of cancellation or modification.
        </p>
        <div className="mt-6 text-center">
          <p className="text-lg font-bold text-slate-700">Thank You For Your Business</p>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [businessFilter, setBusinessFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'asc' | 'desc' } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { phone: customerPhone } = useParams<{ phone: string }>();
  const [showViewDialog, setShowViewDialog] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  useEffect(() => {
    if (customerPhone && invoices.length > 0) {
      const invoice = invoices.find(inv => inv.id === customerPhone);
      if (invoice) {
        setSelectedInvoice(invoice);
        setShowViewDialog(true);
      }
    }
  }, [customerPhone, invoices]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Success", description: "Invoice deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(inv => 
        inv.invoiceNo.toLowerCase().includes(lowerSearch) ||
        inv.customerName.toLowerCase().includes(lowerSearch) ||
        inv.phoneNumber.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter
    if (businessFilter !== "all") {
      result = result.filter(inv => inv.business === businessFilter);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [invoices, searchTerm, businessFilter, sortConfig]);

  const handleSort = (key: keyof Invoice) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewDialog(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Invoices</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Search Invoices</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by invoice no, customer name..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-invoices"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Business Filter</label>
            <Select value={businessFilter} onValueChange={setBusinessFilter}>
              <SelectTrigger data-testid="select-business-filter">
                <SelectValue placeholder="All Businesses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="Auto Gamma">Auto Gamma</SelectItem>
                <SelectItem value="AGNX">AGNX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle>Invoice List</CardTitle>
            <Badge variant="outline">{filteredInvoices.length} Found</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort('invoiceNo')}>
                    <div className="flex items-center gap-2">
                      Invoice No <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort('business')}>
                    <div className="flex items-center gap-2">
                      Business <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center gap-2">
                      Customer <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort('totalAmount')}>
                    <div className="flex items-center gap-2 justify-end">
                      Total Amount <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invoices found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-slate-50/50" data-testid={`row-invoice-${inv.id}`}>
                      <TableCell className="font-medium">{inv.invoiceNo}</TableCell>
                      <TableCell>
                        <Badge variant={inv.business === "Auto Gamma" ? "destructive" : "outline"} className={inv.business === "Auto Gamma" ? "bg-red-600" : ""}>
                          {inv.business}
                        </Badge>
                      </TableCell>
                      <TableCell>{inv.customerName}</TableCell>
                      <TableCell>{format(new Date(inv.date || new Date()), "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        ₹{inv.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleView(inv)} 
                            className="h-8 w-8"
                            data-testid={`button-view-invoice-${inv.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (inv.id && confirm("Are you sure you want to delete this invoice?")) {
                                deleteMutation.mutate(inv.id);
                              }
                            }}
                            data-testid={`button-delete-invoice-${inv.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Invoice Detail</span>
              <Badge variant={selectedInvoice?.business === "Auto Gamma" ? "destructive" : "outline"} className={selectedInvoice?.business === "Auto Gamma" ? "bg-red-600" : "text-lg px-4 py-1"}>
                {selectedInvoice?.business}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div ref={printRef}>
              <PrintableInvoice invoice={selectedInvoice} />
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowViewDialog(false)} data-testid="button-close-invoice">
              Close
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handlePrint}
              data-testid="button-print-invoice"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}
