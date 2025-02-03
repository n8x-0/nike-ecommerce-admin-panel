export type PackagesT = {
    quantity: number;
    id: string;
    total: number;
    image: string
  }[];
  
  export type OrderT = {
    phone: string;
    _createdAt: string; // ISO date string
    _type: 'order';
    orderData: {
      labelID: string,
      status: string,
      trackingNumber: string,
      trackingStatus: string,
      label: {
        zpl: string,
        pdf: string,
        href: string,
        png: string,
      },
      shipmentCost: { amount: number, currency: string },
    };
    trackingNumber: string;
    status: 'completed' | 'in_progress' | 'pending'; // Add additional statuses if needed
    labelID: string;
    shipmentCost: {
      amount: number;
      currency: string;
    };
    label: {
      pdf: string;
      zpl: string;
      png: string;
      href: string;
    };
    trackingStatus: 'in_transit' | 'delivered' | 'pending'; // Add additional statuses if needed
    email: string;
    _rev: string;
    _id: string;
    packages: PackagesT;
    _updatedAt: string; // ISO date string
  };