import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSession, ChatSessionDocument } from './schemas/chat-session.schema';
import { ProductsService } from '../products/products.service';
import { VendorsService } from '../modules/vendors/vendors.service';
import { UsersService } from '../modules/users/users.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { LocationSearchDto } from './dto/location-search.dto';
import { PriceRangeSearchDto } from './dto/price-range-search.dto';
import { SupportQueryDto } from './dto/support-query.dto';

@Injectable()
export class AiAssistantService {
  constructor(
    @InjectModel(ChatSession.name) private chatSessionModel: Model<ChatSessionDocument>,
    private productsService: ProductsService,
    private vendorsService: VendorsService,
    private usersService: UsersService,
  ) {}

  async processMessage(userId: string, chatMessageDto: ChatMessageDto) {
    const { message, sessionId } = chatMessageDto;
    
    // Get or create chat session
    let session = sessionId 
      ? await this.getOrCreateSession(userId, sessionId)
      : await this.createNewSession(userId);

    // Analyze message intent
    const intent = await this.analyzeMessageIntent(message);
    
    // Process based on intent
    let response;
    switch (intent.type) {
      case 'product_search':
        response = await this.handleProductSearch(userId, intent.data);
        break;
      case 'discount_search':
        response = await this.handleDiscountSearch(userId, intent.data);
        break;
      case 'price_range':
        response = await this.handlePriceRangeSearch(userId, intent.data);
        break;
      case 'location_search':
        response = await this.handleLocationSearch(userId, intent.data);
        break;
      case 'support':
        response = await this.handleSupportQuery(userId, intent.data);
        break;
      case 'navigation':
        response = await this.handleNavigationHelp(userId, intent.data);
        break;
      default:
        response = await this.handleGeneralQuery(userId, message);
    }

    // Save conversation to session
    await this.saveConversation(session._id, message, response.message);

    return {
      sessionId: session._id,
      response: response.message,
      suggestions: response.suggestions || [],
      products: response.products || [],
      intent: intent.type,
    };
  }

  async searchProducts(userId: string, searchDto: ProductSearchDto) {
    const { query, category, limit = 10 } = searchDto;
    
    const filter: any = {
      search: query,
      category,
      limit,
      page: 1,
    };

    const products = await this.productsService.search(query, filter);
    
    return {
      message: `Found ${products.length} products matching "${query}"`,
      products,
      suggestions: await this.generateSearchSuggestions(query),
    };
  }

  async findDiscountedProducts(userId: string, searchDto: ProductSearchDto) {
    const { query, category, limit = 20 } = searchDto;
    
    const products = await this.productsService.getOnSale(limit);
    
    // Filter by category if specified
    const filteredProducts = category 
      ? products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
      : products;

    // Filter by search query if specified
    const finalProducts = query
      ? filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        )
      : filteredProducts;

    return {
      message: `Found ${finalProducts.length} discounted products`,
      products: finalProducts,
      suggestions: [
        'Check out flash sales',
        'Set up price alerts',
        'Browse clearance items',
      ],
    };
  }

  async findProductsByPriceRange(userId: string, priceRangeDto: PriceRangeSearchDto) {
    const { minPrice, maxPrice, category, query, limit = 20 } = priceRangeDto;
    
    const filter: any = {
      minPrice,
      maxPrice,
      category,
      search: query,
      limit,
      page: 1,
    };

    const products = await this.productsService.findAll(filter);
    
    return {
      message: `Found ${products.length} products between ₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`,
      products,
      priceRange: { min: minPrice, max: maxPrice },
      suggestions: [
        'Try expanding your price range',
        'Check similar products',
        'Set up price alerts',
      ],
    };
  }

  async findProductsByLocation(userId: string, locationDto: LocationSearchDto) {
    const { location, radius = 50, query, limit = 20 } = locationDto;
    
    // Find vendors in the specified location
    const vendors = await this.vendorsService.findAll({
      search: location,
      verified: true,
      limit: 100,
    });

    if (vendors.length === 0) {
      return {
        message: `No vendors found in ${location}`,
        products: [],
        suggestions: [
          'Try a nearby city',
          'Expand search radius',
          'Check delivery options',
        ],
      };
    }

    // Get products from these vendors
    const vendorIds = vendors.map(v => v._id.toString());
    const allProducts = [];

    for (const vendorId of vendorIds.slice(0, 10)) { // Limit to first 10 vendors
      const products = await this.productsService.findByVendor(vendorId, {
        search: query,
        limit: Math.ceil(limit / Math.min(vendorIds.length, 10)),
      });
      allProducts.push(...products);
    }

    return {
      message: `Found ${allProducts.length} products from vendors in ${location}`,
      products: allProducts.slice(0, limit),
      vendors: vendors.slice(0, 5),
      location,
      suggestions: [
        'Check vendor ratings',
        'Compare delivery times',
        'View vendor profiles',
      ],
    };
  }

  async provideSupportAssistance(userId: string, supportDto: SupportQueryDto) {
    const { query, category } = supportDto;
    
    const supportResponses = {
      'order': {
        message: 'I can help you with order-related questions.',
        actions: [
          'Track your order',
          'Cancel an order',
          'Return/refund process',
          'Order history',
        ],
        links: [
          { text: 'My Orders', url: '/orders' },
          { text: 'Order Tracking', url: '/orders/track' },
        ],
      },
      'payment': {
        message: 'I can assist with payment and billing questions.',
        actions: [
          'Payment methods',
          'Transaction history',
          'Refund status',
          'Payment security',
        ],
        links: [
          { text: 'Payment Settings', url: '/profile/payments' },
          { text: 'Transaction History', url: '/payments/history' },
        ],
      },
      'shipping': {
        message: 'Here\'s help with shipping and delivery.',
        actions: [
          'Delivery options',
          'Shipping costs',
          'Delivery tracking',
          'Address management',
        ],
        links: [
          { text: 'Delivery Settings', url: '/profile/addresses' },
          { text: 'Track Package', url: '/orders/track' },
        ],
      },
      'account': {
        message: 'I can help with account management.',
        actions: [
          'Profile settings',
          'Password reset',
          'Email verification',
          'Account security',
        ],
        links: [
          { text: 'Profile Settings', url: '/profile' },
          { text: 'Security Settings', url: '/profile/security' },
        ],
      },
      'vendor': {
        message: 'Here\'s help for vendor-related questions.',
        actions: [
          'Become a vendor',
          'Vendor verification',
          'Store management',
          'Product listing',
        ],
        links: [
          { text: 'Vendor Registration', url: '/vendor/register' },
          { text: 'Vendor Dashboard', url: '/vendor/dashboard' },
        ],
      },
    };

    const categoryKey = category?.toLowerCase() || 'general';
    const support = supportResponses[categoryKey] || {
      message: 'I\'m here to help! What do you need assistance with?',
      actions: [
        'Browse products',
        'Check order status',
        'Contact support',
        'App navigation',
      ],
      links: [
        { text: 'Help Center', url: '/help' },
        { text: 'Contact Support', url: '/support' },
      ],
    };

    // Save support interaction
    await this.saveSupportInteraction(userId, query, support.message);

    return {
      message: support.message,
      actions: support.actions,
      links: support.links,
      category: categoryKey,
      suggestions: [
        'Ask about specific features',
        'Get product recommendations',
        'Learn about app features',
      ],
    };
  }

  async getPersonalizedSuggestions(userId: string, category?: string, limit: number = 10) {
    // Get user's order history for personalization
    const user = await this.usersService.findOne(userId);
    
    // Get trending products
    const trending = await this.productsService.getTrending(5);
    
    // Get featured products
    const featured = await this.productsService.getFeatured(5);
    
    // Get products by category if specified
    const categoryProducts = category 
      ? await this.productsService.getByCategory(category, { limit: 5 })
      : [];

    const suggestions = [
      ...trending.slice(0, 3),
      ...featured.slice(0, 3),
      ...categoryProducts.slice(0, 4),
    ].slice(0, limit);

    return {
      message: `Here are ${suggestions.length} personalized suggestions for you`,
      products: suggestions,
      categories: await this.productsService.getCategories(),
      recommendations: [
        'Based on trending items',
        'Featured products',
        category ? `Popular in ${category}` : 'Popular categories',
      ],
    };
  }

  async getNavigationHelp(userId: string, section?: string) {
    const navigationGuides = {
      'products': {
        title: 'Product Navigation',
        steps: [
          'Browse categories from the main menu',
          'Use search filters to narrow results',
          'Click on products for detailed views',
          'Add items to cart or wishlist',
        ],
        tips: [
          'Use the search bar for quick finds',
          'Filter by price, rating, or location',
          'Check product reviews before buying',
        ],
      },
      'orders': {
        title: 'Order Management',
        steps: [
          'View all orders in "My Orders"',
          'Track order status and delivery',
          'Download invoices and receipts',
          'Request returns or refunds',
        ],
        tips: [
          'Save delivery addresses for faster checkout',
          'Enable order notifications',
          'Keep track of return windows',
        ],
      },
      'vendor': {
        title: 'Vendor Features',
        steps: [
          'Register as a vendor',
          'Complete KYC verification',
          'Set up your store profile',
          'List and manage products',
        ],
        tips: [
          'Complete your profile for better visibility',
          'Use high-quality product images',
          'Respond quickly to customer inquiries',
        ],
      },
      'profile': {
        title: 'Profile Management',
        steps: [
          'Update personal information',
          'Manage delivery addresses',
          'Set notification preferences',
          'Review order history',
        ],
        tips: [
          'Keep your contact info updated',
          'Enable two-factor authentication',
          'Review privacy settings regularly',
        ],
      },
    };

    const guide = navigationGuides[section] || {
      title: 'App Navigation',
      steps: [
        'Explore the main dashboard',
        'Use the search functionality',
        'Browse product categories',
        'Manage your profile and orders',
      ],
      tips: [
        'Use the help icon for quick assistance',
        'Check notifications for updates',
        'Explore all menu options',
      ],
    };

    return {
      message: `Here's help with ${guide.title}`,
      guide,
      quickActions: [
        { text: 'Browse Products', action: 'navigate_products' },
        { text: 'My Orders', action: 'navigate_orders' },
        { text: 'Profile Settings', action: 'navigate_profile' },
        { text: 'Help Center', action: 'navigate_help' },
      ],
    };
  }

  async compareProducts(userId: string, productIds: string[]) {
    if (productIds.length < 2) {
      throw new BadRequestException('At least 2 products are required for comparison');
    }

    const products = await Promise.all(
      productIds.map(id => this.productsService.findOne(id))
    );

    const comparison = {
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice: product.price - (product.discount || 0),
        rating: product.rating,
        reviews: product.reviewCount,
        vendor: product.vendorId,
        inStock: product.inventory.stock > 0,
        specifications: product.specifications,
      })),
      analysis: {
        cheapest: products.reduce((min, p) => 
          (p.price - (p.discount || 0)) < (min.price - (min.discount || 0)) ? p : min
        ),
        highestRated: products.reduce((max, p) => p.rating > max.rating ? p : max),
        bestValue: products.reduce((best, p) => {
          const value = p.rating / (p.price - (p.discount || 0)) * 1000;
          const bestValue = best.rating / (best.price - (best.discount || 0)) * 1000;
          return value > bestValue ? p : best;
        }),
      },
    };

    await this.saveComparison(userId, productIds, comparison);

    return {
      message: `Comparison of ${products.length} products`,
      comparison,
      recommendations: [
        `Best price: ${comparison.analysis.cheapest.name}`,
        `Highest rated: ${comparison.analysis.highestRated.name}`,
        `Best value: ${comparison.analysis.bestValue.name}`,
      ],
    };
  }

  async getAiRecommendations(userId: string, productId: string) {
    const product = await this.productsService.findOne(productId);
    
    // Get related products
    const related = await this.productsService.getRelatedProducts(productId, 5);
    
    // Get products from same vendor
    const vendorProducts = await this.productsService.findByVendor(
      product.vendorId.toString(), 
      { limit: 3 }
    );
    
    // Get trending in same category
    const categoryTrending = await this.productsService.getByCategory(
      product.category, 
      { limit: 3 }
    );

    return {
      message: `Recommendations based on ${product.name}`,
      baseProduct: {
        id: product._id,
        name: product.name,
        category: product.category,
      },
      recommendations: {
        related: related.slice(0, 3),
        fromSameVendor: vendorProducts.filter(p => p._id.toString() !== productId).slice(0, 2),
        trending: categoryTrending.filter(p => p._id.toString() !== productId).slice(0, 2),
      },
      insights: [
        `This product is in the ${product.category} category`,
        `Average rating: ${product.rating}/5`,
        `${product.sales} people have bought this`,
        product.discount > 0 ? `Currently ${product.discount}% off!` : 'Regular price',
      ],
    };
  }

  // Helper methods
  private async analyzeMessageIntent(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Product search patterns
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
      if (lowerMessage.includes('discount') || lowerMessage.includes('sale') || lowerMessage.includes('cheap')) {
        return { type: 'discount_search', data: { query: message } };
      }
      if (lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('₦')) {
        return { type: 'price_range', data: { query: message } };
      }
      if (lowerMessage.includes('near') || lowerMessage.includes('location') || lowerMessage.includes('city')) {
        return { type: 'location_search', data: { query: message } };
      }
      return { type: 'product_search', data: { query: message } };
    }
    
    // Support patterns
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      return { type: 'support', data: { query: message } };
    }
    
    // Navigation patterns
    if (lowerMessage.includes('how to') || lowerMessage.includes('navigate') || lowerMessage.includes('where')) {
      return { type: 'navigation', data: { query: message } };
    }
    
    return { type: 'general', data: { query: message } };
  }

  private async handleProductSearch(userId: string, data: any) {
    const products = await this.productsService.search(data.query, { limit: 8 });
    
    return {
      message: `I found ${products.length} products for "${data.query}"`,
      products,
      suggestions: [
        'Refine your search',
        'Filter by category',
        'Sort by price or rating',
      ],
    };
  }

  private async handleDiscountSearch(userId: string, data: any) {
    const products = await this.productsService.getOnSale(10);
    
    return {
      message: `Here are the best deals available right now!`,
      products,
      suggestions: [
        'Check flash sales',
        'Set price alerts',
        'Browse clearance',
      ],
    };
  }

  private async handlePriceRangeSearch(userId: string, data: any) {
    // Extract price range from query
    const priceMatch = data.query.match(/₦?(\d+(?:,\d+)*)\s*-\s*₦?(\d+(?:,\d+)*)/);
    
    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
      const maxPrice = parseInt(priceMatch[2].replace(/,/g, ''));
      
      const products = await this.productsService.findAll({
        minPrice,
        maxPrice,
        limit: 10,
      });
      
      return {
        message: `Found ${products.length} products in your price range`,
        products,
        priceRange: { min: minPrice, max: maxPrice },
      };
    }
    
    return {
      message: 'Please specify a price range (e.g., "₦5,000 - ₦20,000")',
      suggestions: [
        'Try: "Products under ₦10,000"',
        'Try: "Items between ₦5,000 - ₦15,000"',
        'Browse by category first',
      ],
    };
  }

  private async handleLocationSearch(userId: string, data: any) {
    // Extract location from query
    const locationMatch = data.query.match(/(?:in|near|from)\s+([a-zA-Z\s]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : 'your area';
    
    return this.findProductsByLocation(userId, { location, query: data.query });
  }

  private async handleSupportQuery(userId: string, data: any) {
    return {
      message: 'I\'m here to help! What do you need assistance with?',
      supportOptions: [
        { category: 'Orders', description: 'Track, cancel, or return orders' },
        { category: 'Payments', description: 'Payment methods and billing' },
        { category: 'Shipping', description: 'Delivery and shipping info' },
        { category: 'Account', description: 'Profile and account settings' },
        { category: 'Products', description: 'Product information and availability' },
      ],
      quickActions: [
        'Contact live support',
        'Browse FAQ',
        'Report an issue',
      ],
    };
  }

  private async handleNavigationHelp(userId: string, data: any) {
    return {
      message: 'I can help you navigate the app!',
      navigationTips: [
        'Use the search bar to find specific products',
        'Browse categories from the main menu',
        'Check your orders in the profile section',
        'Use filters to narrow down results',
      ],
      quickLinks: [
        { text: 'Home', url: '/' },
        { text: 'Categories', url: '/categories' },
        { text: 'My Orders', url: '/orders' },
        { text: 'Profile', url: '/profile' },
      ],
    };
  }

  private async handleGeneralQuery(userId: string, message: string) {
    return {
      message: 'I can help you find products, get support, or navigate the app. What would you like to do?',
      suggestions: [
        'Search for products',
        'Find deals and discounts',
        'Get customer support',
        'Learn how to use the app',
      ],
    };
  }

  private async getOrCreateSession(userId: string, sessionId: string) {
    let session = await this.chatSessionModel.findOne({ 
      _id: sessionId, 
      userId 
    }).exec();
    
    if (!session) {
      session = await this.createNewSession(userId);
    }
    
    return session;
  }

  private async createNewSession(userId: string) {
    const session = new this.chatSessionModel({
      userId,
      title: 'New Chat',
      messages: [],
    });
    
    return session.save();
  }

  private async saveConversation(sessionId: string, userMessage: string, aiResponse: string) {
    await this.chatSessionModel.findByIdAndUpdate(sessionId, {
      $push: {
        messages: [
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
          },
          {
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
          },
        ],
      },
      lastActivity: new Date(),
    });
  }

  private async saveSupportInteraction(userId: string, query: string, response: string) {
    // Create a support session if needed
    const session = await this.createNewSession(userId);
    await this.saveConversation(session._id, query, response);
  }

  private async saveComparison(userId: string, productIds: string[], comparison: any) {
    const session = await this.createNewSession(userId);
    await this.saveConversation(
      session._id, 
      `Compare products: ${productIds.join(', ')}`,
      `Product comparison completed for ${productIds.length} items`
    );
  }

  private async generateSearchSuggestions(query: string): Promise<string[]> {
    // Get categories for suggestions
    const categories = await this.productsService.getCategories();
    
    return [
      `Try searching in ${categories[0]} category`,
      'Filter by price range',
      'Check vendor ratings',
      'Look for similar products',
    ].slice(0, 3);
  }

  async getUserSessions(userId: string) {
    return this.chatSessionModel
      .find({ userId })
      .sort({ lastActivity: -1 })
      .limit(20)
      .select('title lastActivity messageCount')
      .exec();
  }

  async getSession(userId: string, sessionId: string) {
    const session = await this.chatSessionModel
      .findOne({ _id: sessionId, userId })
      .exec();
      
    if (!session) {
      throw new NotFoundException('Chat session not found');
    }
    
    return session;
  }

  async deleteSession(userId: string, sessionId: string) {
    const result = await this.chatSessionModel
      .findOneAndDelete({ _id: sessionId, userId })
      .exec();
      
    if (!result) {
      throw new NotFoundException('Chat session not found');
    }
    
    return { message: 'Chat session deleted successfully' };
  }
}