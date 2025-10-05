"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAssistantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_session_schema_1 = require("./schemas/chat-session.schema");
const products_service_1 = require("../products/products.service");
const vendors_service_1 = require("../modules/vendors/vendors.service");
const users_service_1 = require("../modules/users/users.service");
let AiAssistantService = class AiAssistantService {
    constructor(chatSessionModel, productsService, vendorsService, usersService) {
        this.chatSessionModel = chatSessionModel;
        this.productsService = productsService;
        this.vendorsService = vendorsService;
        this.usersService = usersService;
    }
    async processMessage(userId, chatMessageDto) {
        const { message, sessionId } = chatMessageDto;
        let session = sessionId
            ? await this.getOrCreateSession(userId, sessionId)
            : await this.createNewSession(userId);
        const intent = await this.analyzeMessageIntent(message);
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
            case 'blog_content':
                response = await this.handleBlogContentRequest(userId, intent.data);
                break;
            case 'content_suggestions':
                response = await this.handleContentSuggestions(userId, intent.data);
                break;
            default:
                response = await this.handleGeneralQuery(userId, message);
        }
        await this.saveConversation(session._id, message, response.message);
        return {
            sessionId: session._id,
            response: response.message,
            suggestions: response.suggestions || [],
            products: response.products || [],
            intent: intent.type,
        };
    }
    async searchProducts(userId, searchDto) {
        const { query, category, limit = 10 } = searchDto;
        const filter = {
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
    async findDiscountedProducts(userId, searchDto) {
        const { query, category, limit = 20 } = searchDto;
        const products = await this.productsService.getOnSale(limit);
        const filteredProducts = category
            ? products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
            : products;
        const finalProducts = query
            ? filteredProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase()))
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
    async findProductsByPriceRange(userId, priceRangeDto) {
        const { minPrice, maxPrice, category, query, limit = 20 } = priceRangeDto;
        const filter = {
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
    async findProductsByLocation(userId, locationDto) {
        const { location, radius = 50, query, limit = 20 } = locationDto;
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
        const vendorIds = vendors.map(v => v._id.toString());
        const allProducts = [];
        for (const vendorId of vendorIds.slice(0, 10)) {
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
    async provideSupportAssistance(userId, supportDto) {
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
    async getPersonalizedSuggestions(userId, category, limit = 10) {
        const user = await this.usersService.findOne(userId);
        const trending = await this.productsService.getTrending(5);
        const featured = await this.productsService.getFeatured(5);
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
    async getNavigationHelp(userId, section) {
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
    async compareProducts(userId, productIds) {
        if (productIds.length < 2) {
            throw new common_1.BadRequestException('At least 2 products are required for comparison');
        }
        const products = await Promise.all(productIds.map(id => this.productsService.findOne(id)));
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
                cheapest: products.reduce((min, p) => (p.price - (p.discount || 0)) < (min.price - (min.discount || 0)) ? p : min),
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
    async getAiRecommendations(userId, productId) {
        const product = await this.productsService.findOne(productId);
        const related = await this.productsService.getRelatedProducts(productId, 5);
        const vendorProducts = await this.productsService.findByVendor(product.vendorId.toString(), { limit: 3 });
        const categoryTrending = await this.productsService.getByCategory(product.category, { limit: 3 });
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
    async analyzeMessageIntent(message) {
        const lowerMessage = message.toLowerCase();
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
        if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
            return { type: 'support', data: { query: message } };
        }
        if (lowerMessage.includes('how to') || lowerMessage.includes('navigate') || lowerMessage.includes('where')) {
            return { type: 'navigation', data: { query: message } };
        }
        return { type: 'general', data: { query: message } };
    }
    async handleProductSearch(userId, data) {
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
    async handleDiscountSearch(userId, data) {
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
    async handlePriceRangeSearch(userId, data) {
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
    async handleLocationSearch(userId, data) {
        const locationMatch = data.query.match(/(?:in|near|from)\s+([a-zA-Z\s]+)/i);
        const location = locationMatch ? locationMatch[1].trim() : 'your area';
        return this.findProductsByLocation(userId, { location, query: data.query });
    }
    async handleSupportQuery(userId, data) {
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
    async handleNavigationHelp(userId, data) {
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
    async handleGeneralQuery(userId, message) {
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
    async getOrCreateSession(userId, sessionId) {
        let session = await this.chatSessionModel.findOne({
            _id: sessionId,
            userId
        }).exec();
        if (!session) {
            session = await this.createNewSession(userId);
        }
        return session;
    }
    async createNewSession(userId) {
        const session = new this.chatSessionModel({
            userId,
            title: 'New Chat',
            messages: [],
        });
        return session.save();
    }
    async saveConversation(sessionId, userMessage, aiResponse) {
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
    async saveSupportInteraction(userId, query, response) {
        const session = await this.createNewSession(userId);
        await this.saveConversation(session._id, query, response);
    }
    async saveComparison(userId, productIds, comparison) {
        const session = await this.createNewSession(userId);
        await this.saveConversation(session._id, `Compare products: ${productIds.join(', ')}`, `Product comparison completed for ${productIds.length} items`);
    }
    async generateSearchSuggestions(query) {
        const categories = await this.productsService.getCategories();
        return [
            `Try searching in ${categories[0]} category`,
            'Filter by price range',
            'Check vendor ratings',
            'Look for similar products',
        ].slice(0, 3);
    }
    async getUserSessions(userId) {
        return this.chatSessionModel
            .find({ userId })
            .sort({ lastActivity: -1 })
            .limit(20)
            .select('title lastActivity messageCount')
            .exec();
    }
    async getSession(userId, sessionId) {
        const session = await this.chatSessionModel
            .findOne({ _id: sessionId, userId })
            .exec();
        if (!session) {
            throw new common_1.NotFoundException('Chat session not found');
        }
        return session;
    }
    async deleteSession(userId, sessionId) {
        const result = await this.chatSessionModel
            .findOneAndDelete({ _id: sessionId, userId })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Chat session not found');
        }
        return { message: 'Chat session deleted successfully' };
    }
    async handleBlogContentRequest(userId, data) {
        const { content, type } = data;
        let response = '';
        let suggestions = [];
        switch (type) {
            case 'auto_tag':
                const tags = await this.generateAutoTags(content);
                response = `I've analyzed your content and suggest these tags: ${tags.join(', ')}`;
                suggestions = tags.map(tag => `Add tag: ${tag}`);
                break;
            case 'content_improvement':
                const improvements = await this.suggestContentImprovements(content);
                response = `Here are some suggestions to improve your content:\n\n${improvements}`;
                suggestions = ['Apply suggestions', 'Generate new content', 'Get more help'];
                break;
            case 'title_suggestions':
                const titles = await this.generateTitleSuggestions(content);
                response = `Here are some engaging title suggestions:\n\n${titles.join('\n')}`;
                suggestions = titles.map(title => `Use: ${title}`);
                break;
            default:
                response = 'I can help you with content creation, auto-tagging, and improvement suggestions. What would you like me to help with?';
                suggestions = ['Auto-tag content', 'Improve content', 'Suggest titles', 'Generate ideas'];
        }
        return { message: response, suggestions };
    }
    async handleContentSuggestions(userId, data) {
        const { topic, category } = data;
        const suggestions = await this.generateContentIdeas(topic, category);
        return {
            message: `Here are some content ideas for "${topic}" in the ${category} category:`,
            suggestions: suggestions.map(idea => `Write about: ${idea}`)
        };
    }
    async generateAutoTags(content) {
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'oil', 'sit', 'try', 'use', 'she', 'put', 'end', 'why', 'let', 'ask', 'run', 'own', 'say', 'too', 'any', 'may', 'call', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
        const filteredWords = words.filter(word => !commonWords.includes(word));
        const wordCount = {};
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        return Object.entries(wordCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
    }
    async suggestContentImprovements(content) {
        const improvements = [];
        if (content.length < 100) {
            improvements.push('• Consider expanding your content with more details and examples');
        }
        if (!content.includes('!') && !content.includes('?')) {
            improvements.push('• Add engaging questions or exclamations to increase reader interaction');
        }
        if (content.split(' ').length < 50) {
            improvements.push('• Provide more comprehensive information to add value for readers');
        }
        if (!content.match(/\d+/)) {
            improvements.push('• Include specific numbers, statistics, or data points to make content more credible');
        }
        if (improvements.length === 0) {
            improvements.push('• Your content looks good! Consider adding a call-to-action to encourage engagement');
        }
        return improvements.join('\n');
    }
    async generateTitleSuggestions(content) {
        const words = content.split(' ').slice(0, 10);
        const baseTitle = words.join(' ');
        return [
            `How to ${baseTitle}: A Complete Guide`,
            `The Ultimate Guide to ${baseTitle}`,
            `${baseTitle}: Everything You Need to Know`,
            `Why ${baseTitle} Matters in 2024`,
            `5 Essential Tips for ${baseTitle}`,
            `The Beginner's Guide to ${baseTitle}`,
            `${baseTitle}: Best Practices and Strategies`
        ];
    }
    async generateContentIdeas(topic, category) {
        const ideas = [];
        switch (category.toLowerCase()) {
            case 'business tips':
                ideas.push(`How to start a ${topic} business in Nigeria`, `Common mistakes to avoid in ${topic}`, `Success stories from ${topic} entrepreneurs`, `Legal requirements for ${topic} businesses`);
                break;
            case 'e-commerce':
                ideas.push(`Setting up an online ${topic} store`, `Digital marketing strategies for ${topic}`, `Payment solutions for ${topic} businesses`, `Customer service best practices for ${topic}`);
                break;
            case 'technology':
                ideas.push(`Technology trends in ${topic}`, `Digital tools for ${topic} businesses`, `Automation in ${topic} operations`, `Cybersecurity for ${topic} companies`);
                break;
            default:
                ideas.push(`Introduction to ${topic}`, `Advanced techniques in ${topic}`, `Common challenges in ${topic}`, `Future of ${topic}`);
        }
        return ideas;
    }
    async moderateContent(content) {
        const issues = [];
        const suggestions = [];
        let confidence = 0.95;
        const inappropriateWords = ['spam', 'scam', 'fake', 'fraud'];
        const hasInappropriate = inappropriateWords.some(word => content.toLowerCase().includes(word));
        if (hasInappropriate) {
            issues.push('Potential inappropriate content detected');
            confidence = 0.3;
        }
        const spamPatterns = [
            /(.)\1{4,}/g,
            /(https?:\/\/[^\s]+){3,}/g,
            /(buy now|click here|limited time){2,}/gi
        ];
        const hasSpam = spamPatterns.some(pattern => pattern.test(content));
        if (hasSpam) {
            issues.push('Spam-like content detected');
            confidence = Math.min(confidence, 0.4);
        }
        if (content.length < 50) {
            issues.push('Content too short');
            suggestions.push('Consider adding more detail to your content');
        }
        if (content.length > 5000) {
            issues.push('Content very long');
            suggestions.push('Consider breaking into multiple posts');
        }
        if (!content.includes('.') && content.length > 100) {
            suggestions.push('Consider adding proper punctuation');
        }
        const isApproved = confidence > 0.7 && issues.length === 0;
        return {
            isApproved,
            confidence,
            issues,
            suggestions
        };
    }
    async detectPlagiarism(content) {
        const similarityScore = Math.random() * 0.3;
        const isOriginal = similarityScore < 0.2;
        const potentialSources = isOriginal ? [] : [
            'Similar content found on example.com',
            'Potential match with article from techblog.net'
        ];
        return {
            isOriginal,
            similarityScore,
            potentialSources
        };
    }
    async generateContentReport(content) {
        const words = content.split(/\s+/).length;
        const readingTime = Math.ceil(words / 200);
        const readabilityScore = Math.min(100, Math.max(0, 100 - (words / 20)));
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing'];
        const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;
        let sentiment = 'neutral';
        if (positiveCount > negativeCount)
            sentiment = 'positive';
        else if (negativeCount > positiveCount)
            sentiment = 'negative';
        const topics = content
            .toLowerCase()
            .match(/\b\w{4,}\b/g) || [];
        const uniqueTopics = [...new Set(topics)].slice(0, 5);
        return {
            wordCount: words,
            readingTime,
            readabilityScore,
            sentiment,
            topics: uniqueTopics,
            language: 'en'
        };
    }
};
exports.AiAssistantService = AiAssistantService;
exports.AiAssistantService = AiAssistantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_session_schema_1.ChatSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        vendors_service_1.VendorsService,
        users_service_1.UsersService])
], AiAssistantService);
//# sourceMappingURL=ai-assistant.service.js.map