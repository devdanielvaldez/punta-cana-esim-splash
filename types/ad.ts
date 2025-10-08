export interface Ad {
    _id: string;
    title: string;
    description: string;
    expirationDate: string;
    amount: number;
    category: string;
    mediaUrl: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      userType: string;
    };
    isActive: boolean;
    externalLink?: string;
    type: 'IMAGE' | 'VIDEO';
    createdAt: string;
    updatedAt: string;
    metrics?: {
      views: number;
      videoPlays: number;
      tripsAssociated: number;
    };
    viewsCount: number;
    totalRevenue: number;
    statistics?: {
      uniqueDriversCount: number;
      lastViewDate?: string;
    };
  }