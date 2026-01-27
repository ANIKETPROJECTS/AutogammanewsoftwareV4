import mongoose from "mongoose";
import { 
  User, 
  InsertUser, 
  DashboardData, 
  ServiceMaster, 
  InsertServiceMaster, 
  PPFMaster,
  InsertPPFMaster,
  AccessoryMaster,
  InsertAccessoryMaster,
  AccessoryCategory,
  VehicleType,
  Technician,
  InsertTechnician,
  Appointment,
  InsertAppointment,
  JobCard,
  InsertJobCard,
  Inquiry,
  InsertInquiry,
  Invoice
} from "@shared/schema";
import session from "express-session";
import MongoStore from "connect-mongodb-session";

const MongoDBStore = MongoStore(session);

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

export const UserModel = mongoose.model("User", userSchema);

const serviceMasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricingByVehicleType: [{
    vehicleType: String,
    price: Number
  }]
});

export const ServiceMasterModel = mongoose.model("ServiceMaster", serviceMasterSchema);

const ppfMasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricingByVehicleType: [{
    vehicleType: String,
    options: [{
      warrantyName: String,
      price: Number
    }]
  }],
  rolls: [{
    name: String,
    stock: Number
  }]
});

export const PPFMasterModel = mongoose.model("PPFMaster", ppfMasterSchema);

const vehicleTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

export const VehicleTypeModel = mongoose.model("VehicleType", vehicleTypeSchema);

const accessoryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

export const AccessoryCategoryModel = mongoose.model("AccessoryCategory", accessoryCategorySchema);

const accessoryMasterSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

export const AccessoryMasterModel = mongoose.model("AccessoryMaster", accessoryMasterSchema);

const technicianMongoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
});

export const TechnicianModel = mongoose.model("Technician", technicianMongoSchema);

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleInfo: { type: String, required: true },
  serviceType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["SCHEDULED", "DONE", "CANCELLED"], default: "SCHEDULED" },
  cancelReason: { type: String },
});

export const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

const inquiryMongoSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  services: [{
    serviceId: String,
    serviceName: String,
    vehicleType: String,
    warrantyName: String,
    price: Number,
    customerPrice: Number
  }],
  accessories: [{
    accessoryId: String,
    accessoryName: String,
    category: String,
    price: Number,
    customerPrice: Number
  }],
  notes: { type: String },
  ourPrice: { type: Number, default: 0 },
  customerPrice: { type: Number, default: 0 },
  date: { type: String, required: true },
  inquiryId: { type: String, required: true },
  isConverted: { type: Boolean, default: false }
});

export const InquiryModel = mongoose.model("Inquiry", inquiryMongoSchema);

const jobCardMongoSchema = new mongoose.Schema({
  jobNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String },
  referralSource: { type: String, required: true },
  referrerName: { type: String },
  referrerPhone: { type: String },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  licensePlate: { type: String, required: true },
  vin: { type: String },
  services: [{ id: String, name: String, price: Number, technician: String, business: { type: String, default: "Auto Gamma" } }],
  ppfs: [{ id: String, name: String, price: Number, technician: String, rollUsed: Number, business: { type: String, default: "Auto Gamma" } }],
  accessories: [{ id: String, name: String, price: Number, quantity: Number, business: { type: String, default: "Auto Gamma" } }],
  laborCharge: { type: Number, default: 0 },
  laborBusiness: { type: String, default: "Auto Gamma" },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 18 },
  serviceNotes: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled"], default: "Pending" },
  date: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  technician: { type: String },
  vehicleType: { type: String }
});

export const JobCardModel = mongoose.model("JobCard", jobCardMongoSchema);

const invoiceMongoSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  jobCardId: { type: String, required: true },
  business: { type: String, enum: ["Auto Gamma", "AGNX"], required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String },
  vehicleInfo: { type: String },
  vehicleMake: { type: String },
  vehicleModel: { type: String },
  vehicleYear: { type: String },
  licensePlate: { type: String },
  vehicleType: { type: String },
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    type: { type: String, enum: ["Service", "PPF", "Accessory", "Labor"] },
    category: String,
    warranty: String,
    vehicleType: String,
    rollUsed: Number,
    technician: String
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  laborCharge: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 18 },
  gstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  paymentMethod: { type: String },
  paymentDate: { type: String }
});

export const InvoiceModel = mongoose.model("Invoice", invoiceMongoSchema);

const ticketMongoSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  note: { type: String, required: true },
  createdAt: { type: String, required: true }
});

export const TicketModel = mongoose.model("Ticket", ticketMongoSchema);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDashboardData(): Promise<DashboardData>;
  
  // Masters
  getServices(): Promise<ServiceMaster[]>;
  createService(service: InsertServiceMaster): Promise<ServiceMaster>;
  updateService(id: string, service: Partial<ServiceMaster>): Promise<ServiceMaster | undefined>;
  deleteService(id: string): Promise<boolean>;

  getPPFs(): Promise<PPFMaster[]>;
  createPPF(ppf: InsertPPFMaster): Promise<PPFMaster>;
  updatePPF(id: string, ppf: Partial<PPFMaster>): Promise<PPFMaster | undefined>;
  deletePPF(id: string): Promise<boolean>;

  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;
  getCustomers(): Promise<any[]>;

  getAccessories(): Promise<AccessoryMaster[]>;
  createAccessory(accessory: InsertAccessoryMaster): Promise<AccessoryMaster>;
  updateAccessory(id: string, accessory: Partial<AccessoryMaster>): Promise<AccessoryMaster | undefined>;
  deleteAccessory(id: string): Promise<boolean>;

  getVehicleTypes(): Promise<VehicleType[]>;
  createVehicleType(name: string): Promise<VehicleType>;

  // Accessory Categories
  getAccessoryCategories(): Promise<AccessoryCategory[]>;
  createAccessoryCategory(name: string): Promise<AccessoryCategory>;
  updateAccessoryCategory(id: string, name: string): Promise<AccessoryCategory | undefined>;
  deleteAccessoryCategory(id: string): Promise<boolean>;

  // Technicians
  getTechnicians(): Promise<Technician[]>;
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  updateTechnician(id: string, technician: Partial<Technician>): Promise<Technician | undefined>;
  deleteTechnician(id: string): Promise<boolean>;

  // User
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined>;
  deleteInquiry(id: string): Promise<boolean>;

  // Tickets
  getTickets(): Promise<any[]>;
  createTicket(ticket: any): Promise<any>;
  updateTicket(id: string, ticket: any): Promise<any | undefined>;
  deleteTicket(id: string): Promise<boolean>;

  // Job Cards
  getJobCard(id: string): Promise<JobCard | undefined>;
  getJobCards(): Promise<JobCard[]>;
  createJobCard(jobCard: InsertJobCard): Promise<JobCard>;
  updateJobCard(id: string, jobCard: Partial<JobCard>): Promise<JobCard | undefined>;
  deleteJobCard(id: string): Promise<boolean>;

  sessionStore: session.Store;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MongoDBStore({
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/autogamma",
      collection: "sessions",
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    return { 
      id: user._id.toString(), 
      email: user.email, 
      password: user.password as string | undefined, 
      name: user.name as string | undefined 
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
    if (!user) return undefined;
    return { 
      id: user._id.toString(), 
      email: user.email, 
      password: user.password as string | undefined, 
      name: user.name as string | undefined 
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    return { id: user._id.toString(), email: user.email, password: user.password };
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) return undefined;
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password as string | undefined,
      name: user.name as string | undefined
    };
  }

  async getDashboardData(): Promise<DashboardData> {
    const inquiries = await InquiryModel.find();
    const jobCards = await JobCardModel.find(); 
    const activeJobsList = await JobCardModel.find({ status: { $in: ["Pending", "In Progress"] } }).limit(5);
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const todayInvoices = await InvoiceModel.find({ 
      date: { $gte: startOfToday.toISOString() } 
    });
    const todaySales = todayInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    
    const inquiriesToday = await InquiryModel.countDocuments({
      date: { $gte: startOfToday.toISOString() }
    });

    const uniquePhones = new Set([
      ...inquiries.map(i => i.phone),
      ...jobCards.map(c => c.phoneNumber)
    ]);

    // Simple weekly sales trends (last 7 days)
    const salesTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      salesTrends.push({ name: dayName, value: 0 });
    }

    return {
      stats: [
        { label: "Today's Sales", value: todaySales.toLocaleString(), subtext: "Total sales generated today", icon: "IndianRupee" },
        { label: "Active Service Jobs", value: activeJobsList.length.toString(), subtext: "Service jobs in progress", icon: "Wrench" },
        { label: "Inquiries Today", value: inquiriesToday.toString(), subtext: "Inquiries received today", icon: "MessageCircle" },
        { label: "Total Customers", value: uniquePhones.size.toString(), subtext: "Registered customers", icon: "Users" },
      ],
      salesTrends,
      customerStatus: [
        { name: "New Lead", value: inquiries.filter(i => i.status === "NEW").length },
        { name: "Completed", value: jobCards.filter(j => j.status === "Completed").length },
      ],
      customerGrowth: [
        { name: "Aug", value: 0 },
        { name: "Sep", value: 0 },
        { name: "Oct", value: 0 },
        { name: "Nov", value: 0 },
        { name: "Dec", value: 0 },
        { name: "Jan", value: uniquePhones.size },
      ],
      inventoryByCategory: [
        { name: "Elite", value: 4 },
        { name: "Garware Plus", value: 7 },
        { name: "Garware Premium", value: 5 },
        { name: "Garware Matt", value: 3 },
      ],
      activeJobs: activeJobsList.map(j => ({
        id: j._id.toString(),
        customerName: j.customerName,
        vehicleInfo: `${j.make} ${j.model}`,
        status: j.status,
      })),
    };
  }

  async getServices(): Promise<ServiceMaster[]> {
    const services = await ServiceMasterModel.find();
    return services.map(s => ({
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any
    }));
  }

  async createService(service: InsertServiceMaster): Promise<ServiceMaster> {
    const s = new ServiceMasterModel(service);
    await s.save();
    return {
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any
    };
  }

  async updateService(id: string, service: Partial<ServiceMaster>): Promise<ServiceMaster | undefined> {
    const s = await ServiceMasterModel.findByIdAndUpdate(id, service, { new: true });
    if (!s) return undefined;
    return {
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any
    };
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await ServiceMasterModel.findByIdAndDelete(id);
    return !!result;
  }

  async getPPFs(): Promise<PPFMaster[]> {
    const ppfs = await PPFMasterModel.find();
    return ppfs.map(s => ({
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any,
      rolls: s.rolls as any
    }));
  }

  async createPPF(ppf: InsertPPFMaster): Promise<PPFMaster> {
    const s = new PPFMasterModel(ppf);
    await s.save();
    return {
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any,
      rolls: s.rolls as any
    };
  }

  async updatePPF(id: string, ppf: Partial<PPFMaster>): Promise<PPFMaster | undefined> {
    const s = await PPFMasterModel.findByIdAndUpdate(id, ppf, { new: true });
    if (!s) return undefined;
    return {
      id: s._id.toString(),
      name: s.name,
      pricingByVehicleType: s.pricingByVehicleType as any,
      rolls: s.rolls as any
    };
  }

  async deletePPF(id: string): Promise<boolean> {
    const result = await PPFMasterModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAccessories(): Promise<AccessoryMaster[]> {
    const accessories = await AccessoryMasterModel.find();
    return accessories.map(a => ({
      id: a._id.toString(),
      category: a.category,
      name: a.name,
      quantity: a.quantity,
      price: a.price
    }));
  }

  async createAccessory(accessory: InsertAccessoryMaster): Promise<AccessoryMaster> {
    const a = new AccessoryMasterModel(accessory);
    await a.save();
    return {
      id: a._id.toString(),
      category: a.category,
      name: a.name,
      quantity: a.quantity,
      price: a.price
    };
  }

  async updateAccessory(id: string, accessory: Partial<AccessoryMaster>): Promise<AccessoryMaster | undefined> {
    const a = await AccessoryMasterModel.findByIdAndUpdate(id, accessory, { new: true });
    if (!a) return undefined;
    return {
      id: a._id.toString(),
      category: a.category,
      name: a.name,
      quantity: a.quantity,
      price: a.price
    };
  }

  async deleteAccessory(id: string): Promise<boolean> {
    const result = await AccessoryMasterModel.findByIdAndDelete(id);
    return !!result;
  }

  async getVehicleTypes(): Promise<VehicleType[]> {
    const types = await VehicleTypeModel.find();
    return types.map(t => ({
      id: t._id.toString(),
      name: t.name
    }));
  }

  async createVehicleType(name: string): Promise<VehicleType> {
    const t = new VehicleTypeModel({ name });
    await t.save();
    return {
      id: t._id.toString(),
      name: t.name
    };
  }

  async getAccessoryCategories(): Promise<AccessoryCategory[]> {
    const categories = await AccessoryCategoryModel.find();
    return categories.map(c => ({
      id: c._id.toString(),
      name: c.name
    }));
  }

  async createAccessoryCategory(name: string): Promise<AccessoryCategory> {
    const c = new AccessoryCategoryModel({ name });
    await c.save();
    return {
      id: c._id.toString(),
      name: c.name
    };
  }

  async updateAccessoryCategory(id: string, name: string): Promise<AccessoryCategory | undefined> {
    const c = await AccessoryCategoryModel.findByIdAndUpdate(id, { name }, { new: true });
    if (!c) return undefined;
    return {
      id: c._id.toString(),
      name: c.name
    };
  }

  async deleteAccessoryCategory(id: string): Promise<boolean> {
    const result = await AccessoryCategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  async getTechnicians(): Promise<Technician[]> {
    const technicians = await TechnicianModel.find();
    return technicians.map(t => ({
      id: t._id.toString(),
      name: t.name,
      specialty: t.specialty,
      phone: t.phone || undefined,
      status: t.status as "active" | "inactive"
    }));
  }

  async createTechnician(technician: InsertTechnician): Promise<Technician> {
    const t = new TechnicianModel(technician);
    await t.save();
    return {
      id: t._id.toString(),
      name: t.name,
      specialty: t.specialty,
      phone: t.phone || undefined,
      status: t.status as "active" | "inactive"
    };
  }

  async updateTechnician(id: string, technician: Partial<Technician>): Promise<Technician | undefined> {
    const t = await TechnicianModel.findByIdAndUpdate(id, technician, { new: true });
    if (!t) return undefined;
    return {
      id: t._id.toString(),
      name: t.name,
      specialty: t.specialty,
      phone: t.phone || undefined,
      status: t.status as "active" | "inactive"
    };
  }

  async deleteTechnician(id: string): Promise<boolean> {
    const result = await TechnicianModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAppointments(): Promise<Appointment[]> {
    const appointments = await AppointmentModel.find();
    return appointments.map(a => ({
      id: a._id.toString(),
      customerName: a.customerName,
      phone: a.phone,
      vehicleInfo: a.vehicleInfo,
      serviceType: a.serviceType,
      date: a.date,
      time: a.time,
      status: a.status as any,
      cancelReason: a.cancelReason || undefined
    }));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const a = new AppointmentModel(appointment);
    await a.save();
    return {
      id: a._id.toString(),
      customerName: a.customerName,
      phone: a.phone,
      vehicleInfo: a.vehicleInfo,
      serviceType: a.serviceType,
      date: a.date,
      time: a.time,
      status: a.status as any
    };
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined> {
    const a = await AppointmentModel.findByIdAndUpdate(id, appointment, { new: true });
    if (!a) return undefined;
    return {
      id: a._id.toString(),
      customerName: a.customerName,
      phone: a.phone,
      vehicleInfo: a.vehicleInfo,
      serviceType: a.serviceType,
      date: a.date,
      time: a.time,
      status: a.status as any,
      cancelReason: a.cancelReason || undefined
    };
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await AppointmentModel.findByIdAndDelete(id);
    return !!result;
  }

  // Job Cards
  async getJobCard(id: string): Promise<JobCard | undefined> {
    const j = await JobCardModel.findById(id);
    if (!j) return undefined;
    return {
      ...j.toObject(),
      id: j._id.toString(),
      services: (j as any).services || [],
      ppfs: (j as any).ppfs || [],
      accessories: (j as any).accessories || [],
      vehicleType: (j as any).vehicleType
    } as JobCard;
  }

  async getJobCards(): Promise<JobCard[]> {
    const jobs = await JobCardModel.find().sort({ date: -1 });
    return jobs.map(j => ({
      ...j.toObject(),
      id: j._id.toString(),
      services: (j as any).services || [],
      ppfs: (j as any).ppfs || [],
      accessories: (j as any).accessories || [],
      vehicleType: (j as any).vehicleType
    })) as JobCard[];
  }

  async getCustomers(): Promise<any[]> {
    try {
      // Collect all unique customers from job cards only (as per user request to only show "actual" customers)
      const jobCards = await JobCardModel.find({}, 'customerName phoneNumber emailAddress');

      const customersMap = new Map();

      jobCards.forEach(jc => {
        const phone = jc.phoneNumber;
        if (phone && !customersMap.has(phone)) {
          customersMap.set(phone, {
            id: jc._id.toString(),
            name: jc.customerName,
            phone: phone,
            email: jc.emailAddress
          });
        }
      });

      const result = Array.from(customersMap.values());
      return result;
    } catch (error) {
      console.error("Error in getCustomers:", error);
      throw error;
    }
  }

  async createJobCard(jobCard: InsertJobCard): Promise<JobCard> {
    const count = await JobCardModel.countDocuments();
    const year = new Date().getFullYear();
    const jobNo = `JC-${year}-${(count + 1).toString().padStart(3, "0")}`;
    
    const j = new JobCardModel({
      ...jobCard,
      jobNo,
      date: new Date().toISOString()
    });
    await j.save();

    // Generate Invoices based on business assignment
    const businesses = ["Auto Gamma", "AGNX"] as const;
    for (const biz of businesses) {
      const bizItems: any[] = [];
      let bizLaborCharge = 0;
      
      // Services
      jobCard.services?.forEach(s => {
        if ((s as any).business === biz) {
          bizItems.push({ 
            name: s.name, 
            price: s.price, 
            type: "Service",
            technician: (s as any).technician,
            vehicleType: jobCard.vehicleType
          });
        }
      });
      
      // PPFs with detailed info
      jobCard.ppfs?.forEach(p => {
        if ((p as any).business === biz) {
          bizItems.push({ 
            name: p.name, 
            price: p.price, 
            type: "PPF",
            warranty: (p as any).warranty || (p as any).warrantyName,
            vehicleType: jobCard.vehicleType,
            rollUsed: (p as any).rollUsed,
            technician: (p as any).technician,
            category: "PPF Application"
          });
        }
      });
      
      // Accessories with category
      jobCard.accessories?.forEach(a => {
        if ((a as any).business === biz) {
          bizItems.push({ 
            name: a.name, 
            price: a.price, 
            quantity: (a as any).quantity || 1, 
            type: "Accessory",
            category: (a as any).category
          });
        }
      });
      
      // Labor - tracked separately
      if ((jobCard as any).laborBusiness === biz && jobCard.laborCharge > 0) {
        bizLaborCharge = jobCard.laborCharge;
        bizItems.push({ name: "Labor Charge", price: jobCard.laborCharge, type: "Labor" });
      }

      if (bizItems.length > 0) {
        const itemsSubtotal = bizItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        const discountAmount = jobCard.discount || 0;
        const subtotalAfterDiscount = itemsSubtotal - discountAmount;
        const gstAmount = Math.round(subtotalAfterDiscount * (jobCard.gst / 100));
        const totalAmount = Math.round(subtotalAfterDiscount + gstAmount);
        
        const invCount = await InvoiceModel.countDocuments({ business: biz });
        const bizPrefix = biz === "Auto Gamma" ? "AG" : "AGNX";
        const invoiceNo = `${bizPrefix}-${year}-${(invCount + 1).toString().padStart(4, "0")}`;
        
        const inv = new InvoiceModel({
          invoiceNo,
          jobCardId: j._id.toString(),
          business: biz,
          customerName: jobCard.customerName,
          phoneNumber: jobCard.phoneNumber,
          emailAddress: jobCard.emailAddress,
          vehicleInfo: `${jobCard.year} ${jobCard.make} ${jobCard.model}`,
          vehicleMake: jobCard.make,
          vehicleModel: jobCard.model,
          vehicleYear: jobCard.year,
          licensePlate: jobCard.licensePlate,
          vehicleType: jobCard.vehicleType,
          items: bizItems,
          subtotal: itemsSubtotal,
          discount: discountAmount,
          laborCharge: bizLaborCharge,
          gstPercentage: jobCard.gst,
          gstAmount,
          totalAmount,
          date: new Date().toISOString()
        });
        await inv.save();
      }
    }

    // Deduct PPF roll inventory
    if (jobCard.ppfs && jobCard.ppfs.length > 0) {
      for (const ppfItem of jobCard.ppfs) {
        const ppfId = (ppfItem as any).ppfId || ppfItem.id;
        console.log(`Checking PPF item for deduction. ppfId: ${ppfId}, rollUsed: ${(ppfItem as any).rollUsed}`);
        if ((ppfItem as any).rollUsed > 0 && ppfId) {
          // Find the PPF master and deduct from the first roll with enough stock
          const ppfMaster = await PPFMasterModel.findById(ppfId);
          if (ppfMaster) {
            console.log(`Found PPF Master: ${ppfMaster.name}. Rolls: ${ppfMaster.rolls.length}`);
            if (ppfMaster.rolls && ppfMaster.rolls.length > 0) {
              let remainingToDeduct = (ppfItem as any).rollUsed;
              for (const roll of ppfMaster.rolls as any) {
                console.log(`Processing roll ${roll.name}. Current stock: ${roll.stock}`);
                if (roll.stock >= remainingToDeduct) {
                  roll.stock -= remainingToDeduct;
                  remainingToDeduct = 0;
                  break;
                } else {
                  remainingToDeduct -= roll.stock;
                  roll.stock = 0;
                }
                if (remainingToDeduct <= 0) break;
              }
              ppfMaster.markModified("rolls");
              const saved = await ppfMaster.save();
              console.log(`Saved PPF Master. New roll stock: ${saved.rolls[0].stock}`);
            }
          } else {
            console.log(`PPF Master not found for id: ${ppfId}`);
          }
        }
      }
    }

    return {
      ...j.toObject(),
      id: j._id.toString()
    } as JobCard;
  }

  async updateJobCard(id: string, jobCard: Partial<JobCard>): Promise<JobCard | undefined> {
    const existingJob = await JobCardModel.findById(id);
    if (!existingJob) return undefined;

    // Handle PPF stock adjustments if ppfs are being updated
    if (jobCard.ppfs) {
      // 1. Revert previous deductions
      if (existingJob.ppfs && existingJob.ppfs.length > 0) {
        for (const ppfItem of existingJob.ppfs) {
          const ppfId = (ppfItem as any).ppfId || ppfItem.id;
          if ((ppfItem as any).rollUsed > 0 && ppfId) {
            const ppfMaster = await PPFMasterModel.findById(ppfId);
            if (ppfMaster && ppfMaster.rolls && ppfMaster.rolls.length > 0) {
              // Add back to the first roll (simplified)
              const firstRoll = ppfMaster.rolls[0] as any;
              firstRoll.stock += (ppfItem as any).rollUsed;
              ppfMaster.markModified("rolls");
              await ppfMaster.save();
            }
          }
        }
      }

      // 2. Apply new deductions
      for (const ppfItem of jobCard.ppfs) {
        const ppfId = (ppfItem as any).ppfId || ppfItem.id;
        if ((ppfItem as any).rollUsed > 0 && ppfId) {
          const ppfMaster = await PPFMasterModel.findById(ppfId);
          if (ppfMaster) {
            if (ppfMaster.rolls && ppfMaster.rolls.length > 0) {
              let remainingToDeduct = (ppfItem as any).rollUsed;
              for (const roll of ppfMaster.rolls as any) {
                if (roll.stock >= remainingToDeduct) {
                  roll.stock -= remainingToDeduct;
                  remainingToDeduct = 0;
                  break;
                } else {
                  remainingToDeduct -= roll.stock;
                  roll.stock = 0;
                }
                if (remainingToDeduct <= 0) break;
              }
              ppfMaster.markModified("rolls");
              await ppfMaster.save();
            }
          }
        }
      }
    }

    const j = await JobCardModel.findByIdAndUpdate(id, jobCard, { new: true });
    if (!j) return undefined;

    // Update associated invoices with new labor charge, discount, and GST
    const year = new Date().getFullYear();
    const businesses = ["Auto Gamma", "AGNX"] as const;
    
    for (const biz of businesses) {
      const bizItems: any[] = [];
      let bizLaborCharge = 0;
      
      // Services
      j.services?.forEach(s => {
        if ((s as any).business === biz) {
          bizItems.push({ 
            name: s.name, 
            price: s.price, 
            type: "Service",
            technician: (s as any).technician,
            vehicleType: (j as any).vehicleType
          });
        }
      });
      
      // PPFs with detailed info
      j.ppfs?.forEach(p => {
        if ((p as any).business === biz) {
          bizItems.push({ 
            name: p.name, 
            price: p.price, 
            type: "PPF",
            warranty: (p as any).warranty || (p as any).warrantyName,
            vehicleType: (j as any).vehicleType,
            rollUsed: (p as any).rollUsed,
            technician: (p as any).technician,
            category: "PPF Application"
          });
        }
      });
      
      // Accessories with category
      j.accessories?.forEach(a => {
        if ((a as any).business === biz) {
          bizItems.push({ 
            name: a.name, 
            price: a.price, 
            quantity: (a as any).quantity || 1, 
            type: "Accessory",
            category: (a as any).category
          });
        }
      });
      
      // Labor - tracked separately
      if ((j as any).laborBusiness === biz && j.laborCharge > 0) {
        bizLaborCharge = j.laborCharge;
        bizItems.push({ name: "Labor Charge", price: j.laborCharge, type: "Labor" });
      }

      // Find existing invoice for this business and job card
      const existingInvoice = await InvoiceModel.findOne({ jobCardId: id, business: biz });
      
      if (bizItems.length > 0) {
        const itemsSubtotal = bizItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        const discountAmount = j.discount || 0;
        const subtotalAfterDiscount = itemsSubtotal - discountAmount;
        const gstAmount = Math.round(subtotalAfterDiscount * (j.gst / 100));
        const totalAmount = Math.round(subtotalAfterDiscount + gstAmount);
        
        if (existingInvoice) {
          // Update existing invoice
          await InvoiceModel.findByIdAndUpdate(existingInvoice._id, {
            customerName: j.customerName,
            phoneNumber: j.phoneNumber,
            emailAddress: j.emailAddress,
            vehicleInfo: `${j.year} ${j.make} ${j.model}`,
            vehicleMake: j.make,
            vehicleModel: j.model,
            vehicleYear: j.year,
            licensePlate: j.licensePlate,
            vehicleType: (j as any).vehicleType,
            items: bizItems,
            subtotal: itemsSubtotal,
            discount: discountAmount,
            laborCharge: bizLaborCharge,
            gstPercentage: j.gst,
            gstAmount,
            totalAmount
          });
        } else {
          // Create new invoice if it doesn't exist
          const invCount = await InvoiceModel.countDocuments({ business: biz });
          const bizPrefix = biz === "Auto Gamma" ? "AG" : "AGNX";
          const invoiceNo = `${bizPrefix}-${year}-${(invCount + 1).toString().padStart(4, "0")}`;
          
          const inv = new InvoiceModel({
            invoiceNo,
            jobCardId: id,
            business: biz,
            customerName: j.customerName,
            phoneNumber: j.phoneNumber,
            emailAddress: j.emailAddress,
            vehicleInfo: `${j.year} ${j.make} ${j.model}`,
            vehicleMake: j.make,
            vehicleModel: j.model,
            vehicleYear: j.year,
            licensePlate: j.licensePlate,
            vehicleType: (j as any).vehicleType,
            items: bizItems,
            subtotal: itemsSubtotal,
            discount: discountAmount,
            laborCharge: bizLaborCharge,
            gstPercentage: j.gst,
            gstAmount,
            totalAmount,
            date: new Date().toISOString()
          });
          await inv.save();
        }
      } else if (existingInvoice) {
        // Remove invoice if no items for this business anymore
        await InvoiceModel.findByIdAndDelete(existingInvoice._id);
      }
    }

    return {
      ...j.toObject(),
      id: j._id.toString(),
      services: j.services || [],
      ppfs: j.ppfs || [],
      accessories: j.accessories || [],
      vehicleType: (j as any).vehicleType
    } as JobCard;
  }

  async deleteJobCard(id: string): Promise<boolean> {
    const existingJob = await JobCardModel.findById(id);
    if (existingJob && existingJob.ppfs && existingJob.ppfs.length > 0) {
      for (const ppfItem of existingJob.ppfs) {
        const ppfId = (ppfItem as any).ppfId || ppfItem.id;
        if ((ppfItem as any).rollUsed > 0 && ppfId) {
          const ppfMaster = await PPFMasterModel.findById(ppfId);
          if (ppfMaster && ppfMaster.rolls && ppfMaster.rolls.length > 0) {
            const firstRoll = ppfMaster.rolls[0] as any;
            firstRoll.stock += (ppfItem as any).rollUsed;
            ppfMaster.markModified("rolls");
            await ppfMaster.save();
          }
        }
      }
    }
    const result = await JobCardModel.findByIdAndDelete(id);
    return !!result;
  }

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    const inquiries = await InquiryModel.find().sort({ date: -1 });
    return inquiries.map(i => ({
      id: i._id.toString(),
      inquiryId: (i as any).inquiryId,
      customerName: i.customerName,
      phone: i.phone,
      email: i.email || undefined,
      services: (i as any).services || [],
      accessories: (i as any).accessories || [],
      notes: i.notes || undefined,
      ourPrice: (i as any).ourPrice || 0,
      customerPrice: (i as any).customerPrice || 0,
      status: (i as any).status as any,
      isConverted: (i as any).isConverted || false,
      createdAt: (i as any).createdAt || (i as any).date 
    })) as Inquiry[];
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const nextInquiryId = `INQ-${Date.now()}`;
    const i = new InquiryModel({
      ...inquiry,
      inquiryId: nextInquiryId,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isConverted: false
    });
    await i.save();
    return {
      id: i._id.toString(),
      inquiryId: (i as any).inquiryId,
      customerName: i.customerName,
      phone: i.phone,
      email: i.email || undefined,
      services: i.services as any,
      accessories: i.accessories as any,
      notes: i.notes || undefined,
      ourPrice: (i as any).ourPrice || 0,
      customerPrice: (i as any).customerPrice || 0,
      status: (i as any).status as any,
      isConverted: false,
      createdAt: (i as any).createdAt || (i as any).date
    };
  }

  async updateInquiry(id: string, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const i = await InquiryModel.findByIdAndUpdate(id, inquiry, { new: true });
    if (!i) return undefined;
    return {
      id: i._id.toString(),
      inquiryId: (i as any).inquiryId,
      customerName: i.customerName,
      phone: i.phone,
      email: i.email || undefined,
      services: (i as any).services as any,
      accessories: (i as any).accessories as any,
      notes: i.notes || undefined,
      ourPrice: (i as any).ourPrice || 0,
      customerPrice: (i as any).customerPrice || 0,
      status: (i as any).status as any,
      isConverted: (i as any).isConverted || false,
      createdAt: (i as any).createdAt || (i as any).date
    };
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const result = await InquiryModel.findByIdAndDelete(id);
    return !!result;
  }

  async getInquiriesByPhone(phone: string): Promise<Inquiry[]> {
    const inquiries = await InquiryModel.find({ phone }).sort({ date: -1 });
    return inquiries.map(i => ({
      id: i._id.toString(),
      inquiryId: (i as any).inquiryId,
      customerName: i.customerName,
      phone: i.phone,
      email: i.email || undefined,
      services: (i as any).services || [],
      accessories: (i as any).accessories || [],
      notes: i.notes || undefined,
      ourPrice: (i as any).ourPrice || 0,
      customerPrice: (i as any).customerPrice || 0,
      status: (i as any).status as any,
      isConverted: (i as any).isConverted || false,
      createdAt: (i as any).createdAt || (i as any).date 
    })) as Inquiry[];
  }

  // Tickets
  async getTickets(): Promise<any[]> {
    const tickets = await TicketModel.find();
    return tickets.map(t => ({
      id: t._id.toString(),
      customerId: t.customerId,
      customerName: t.customerName,
      note: t.note,
      createdAt: t.createdAt
    }));
  }

  async createTicket(ticket: any): Promise<any> {
    const t = new TicketModel({
      ...ticket,
      createdAt: new Date().toISOString()
    });
    await t.save();
    return {
      id: t._id.toString(),
      customerId: t.customerId,
      customerName: t.customerName,
      note: t.note,
      createdAt: t.createdAt
    };
  }

  async updateTicket(id: string, ticket: any): Promise<any | undefined> {
    const t = await TicketModel.findByIdAndUpdate(id, ticket, { new: true });
    if (!t) return undefined;
    return {
      id: t._id.toString(),
      customerId: t.customerId,
      customerName: t.customerName,
      note: t.note,
      createdAt: t.createdAt
    };
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await TicketModel.findByIdAndDelete(id);
    return !!result;
  }

  async getInvoices(): Promise<Invoice[]> {
    const invoices = await InvoiceModel.find().sort({ date: -1 });
    const enrichedInvoices: Invoice[] = [];
    
    for (const inv of invoices) {
      const obj = inv.toObject();
      let enrichedInvoice: any = {
        ...obj,
        id: inv._id.toString(),
        business: inv.business as "Auto Gamma" | "AGNX",
        discount: obj.discount ?? 0,
        laborCharge: obj.laborCharge ?? 0,
        gstPercentage: obj.gstPercentage ?? 18,
        isPaid: obj.isPaid ?? false,
        paymentMethod: obj.paymentMethod,
        paymentDate: obj.paymentDate,
      };
      
      // Enrich with job card data if vehicle details are missing
      if (inv.jobCardId && (!inv.vehicleMake || !inv.licensePlate)) {
        try {
          const jobCard = await JobCardModel.findById(inv.jobCardId);
          if (jobCard) {
            enrichedInvoice.vehicleMake = enrichedInvoice.vehicleMake || jobCard.make;
            enrichedInvoice.vehicleModel = enrichedInvoice.vehicleModel || jobCard.model;
            enrichedInvoice.vehicleYear = enrichedInvoice.vehicleYear || jobCard.year;
            enrichedInvoice.licensePlate = enrichedInvoice.licensePlate || jobCard.licensePlate;
            enrichedInvoice.vehicleType = enrichedInvoice.vehicleType || jobCard.vehicleType;
            
            // Enrich items with sub-details from job card
            if (enrichedInvoice.items && enrichedInvoice.items.length > 0) {
              enrichedInvoice.items = enrichedInvoice.items.map((item: any) => {
                // PPF items - match by name and enrich with warranty, rollUsed
                if (item.type === "PPF" && jobCard.ppfs) {
                  const matchingPpf = (jobCard.ppfs as any[]).find(p => p.name === item.name);
                  if (matchingPpf) {
                    return {
                      ...item,
                      warranty: item.warranty || matchingPpf.warranty || matchingPpf.warrantyName,
                      rollUsed: item.rollUsed || matchingPpf.rollUsed,
                      vehicleType: item.vehicleType || jobCard.vehicleType,
                      technician: item.technician || matchingPpf.technician,
                    };
                  }
                }
                // Service items
                if (item.type === "Service" && jobCard.services) {
                  const matchingService = (jobCard.services as any[]).find(s => s.name === item.name);
                  if (matchingService) {
                    return {
                      ...item,
                      vehicleType: item.vehicleType || jobCard.vehicleType,
                      technician: item.technician || matchingService.technician,
                    };
                  }
                }
                // Accessory items
                if (item.type === "Accessory" && jobCard.accessories) {
                  const matchingAccessory = (jobCard.accessories as any[]).find(a => a.name === item.name);
                  if (matchingAccessory) {
                    return {
                      ...item,
                      category: item.category || matchingAccessory.category,
                      quantity: item.quantity || matchingAccessory.quantity,
                    };
                  }
                }
                return item;
              });
            }
          }
        } catch (e) {
          console.error("Error enriching invoice with job card data:", e);
        }
      }
      
      enrichedInvoices.push(enrichedInvoice as Invoice);
    }
    
    return enrichedInvoices;
  }

  async getInvoicesByPhone(phone: string): Promise<Invoice[]> {
    const invoices = await InvoiceModel.find({ phoneNumber: phone }).sort({ date: -1 });
    const enrichedInvoices: Invoice[] = [];
    
    for (const inv of invoices) {
      const obj = inv.toObject();
      let enrichedInvoice: any = {
        ...obj,
        id: inv._id.toString(),
        business: inv.business as "Auto Gamma" | "AGNX",
        discount: obj.discount ?? 0,
        laborCharge: obj.laborCharge ?? 0,
        gstPercentage: obj.gstPercentage ?? 18,
      };
      
      // Enrich with job card data if vehicle details are missing
      if (inv.jobCardId && (!inv.vehicleMake || !inv.licensePlate)) {
        try {
          const jobCard = await JobCardModel.findById(inv.jobCardId);
          if (jobCard) {
            enrichedInvoice.vehicleMake = enrichedInvoice.vehicleMake || jobCard.make;
            enrichedInvoice.vehicleModel = enrichedInvoice.vehicleModel || jobCard.model;
            enrichedInvoice.vehicleYear = enrichedInvoice.vehicleYear || jobCard.year;
            enrichedInvoice.licensePlate = enrichedInvoice.licensePlate || jobCard.licensePlate;
            enrichedInvoice.vehicleType = enrichedInvoice.vehicleType || jobCard.vehicleType;
            
            // Enrich items with sub-details
            if (enrichedInvoice.items && enrichedInvoice.items.length > 0) {
              enrichedInvoice.items = enrichedInvoice.items.map((item: any) => {
                if (item.type === "PPF" && jobCard.ppfs) {
                  const matchingPpf = (jobCard.ppfs as any[]).find(p => p.name === item.name);
                  if (matchingPpf) {
                    return {
                      ...item,
                      warranty: item.warranty || matchingPpf.warranty || matchingPpf.warrantyName,
                      rollUsed: item.rollUsed || matchingPpf.rollUsed,
                      vehicleType: item.vehicleType || jobCard.vehicleType,
                      technician: item.technician || matchingPpf.technician,
                    };
                  }
                }
                if (item.type === "Service" && jobCard.services) {
                  const matchingService = (jobCard.services as any[]).find(s => s.name === item.name);
                  if (matchingService) {
                    return {
                      ...item,
                      vehicleType: item.vehicleType || jobCard.vehicleType,
                      technician: item.technician || matchingService.technician,
                    };
                  }
                }
                if (item.type === "Accessory" && jobCard.accessories) {
                  const matchingAccessory = (jobCard.accessories as any[]).find(a => a.name === item.name);
                  if (matchingAccessory) {
                    return {
                      ...item,
                      category: item.category || matchingAccessory.category,
                      quantity: item.quantity || matchingAccessory.quantity,
                    };
                  }
                }
                return item;
              });
            }
          }
        } catch (e) {
          console.error("Error enriching invoice with job card data:", e);
        }
      }
      
      enrichedInvoices.push(enrichedInvoice as Invoice);
    }
    
    return enrichedInvoices;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const inv = await InvoiceModel.findById(id);
    if (!inv) return undefined;
    const obj = inv.toObject();
    return {
      ...obj,
      id: inv._id.toString(),
      items: (inv as any).items || [],
      discount: obj.discount ?? 0,
      laborCharge: obj.laborCharge ?? 0,
      gstPercentage: obj.gstPercentage ?? 18,
      isPaid: obj.isPaid ?? false,
      paymentMethod: obj.paymentMethod,
      paymentDate: obj.paymentDate,
    } as Invoice;
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | undefined> {
    const inv = await InvoiceModel.findByIdAndUpdate(id, invoice, { new: true });
    if (!inv) return undefined;
    const obj = inv.toObject();
    return {
      ...obj,
      id: inv._id.toString(),
      items: (inv as any).items || [],
      discount: obj.discount ?? 0,
      laborCharge: obj.laborCharge ?? 0,
      gstPercentage: obj.gstPercentage ?? 18,
      isPaid: obj.isPaid ?? false,
      paymentMethod: obj.paymentMethod,
      paymentDate: obj.paymentDate,
    } as Invoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const result = await InvoiceModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const storage = new MongoStorage();
