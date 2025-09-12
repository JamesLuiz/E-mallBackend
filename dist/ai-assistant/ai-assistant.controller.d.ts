import { AiAssistantService } from './ai-assistant.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { LocationSearchDto } from './dto/location-search.dto';
import { PriceRangeSearchDto } from './dto/price-range-search.dto';
import { SupportQueryDto } from './dto/support-query.dto';
export declare class AiAssistantController {
    private readonly aiAssistantService;
    constructor(aiAssistantService: AiAssistantService);
    chat(userId: string, chatMessageDto: ChatMessageDto): Promise<{
        sessionId: any;
        response: any;
        suggestions: any;
        products: any;
        intent: string;
    }>;
    getSessions(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/chat-session.schema").ChatSessionDocument> & import("./schemas/chat-session.schema").ChatSession & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getSession(userId: string, sessionId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/chat-session.schema").ChatSessionDocument> & import("./schemas/chat-session.schema").ChatSession & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    searchProducts(userId: string, searchDto: ProductSearchDto): Promise<{
        message: string;
        products: import("../products/schemas/product.schema").ProductDocument[];
        suggestions: string[];
    }>;
    findDiscountedProducts(userId: string, searchDto: ProductSearchDto): Promise<{
        message: string;
        products: import("../products/schemas/product.schema").ProductDocument[];
        suggestions: string[];
    }>;
    findProductsByPriceRange(userId: string, priceRangeDto: PriceRangeSearchDto): Promise<{
        message: string;
        products: import("../products/schemas/product.schema").ProductDocument[];
        priceRange: {
            min: number;
            max: number;
        };
        suggestions: string[];
    }>;
    findProductsByLocation(userId: string, locationDto: LocationSearchDto): Promise<{
        message: string;
        products: any[];
        suggestions: string[];
        vendors?: undefined;
        location?: undefined;
    } | {
        message: string;
        products: any[];
        vendors: import("../modules/vendors/schemas/vendor.schema").VendorDocument[];
        location: string;
        suggestions: string[];
    }>;
    getSupport(userId: string, supportDto: SupportQueryDto): Promise<{
        message: any;
        actions: any;
        links: any;
        category: string;
        suggestions: string[];
    }>;
    getPersonalizedSuggestions(userId: string, category?: string, limit?: number): Promise<{
        message: string;
        products: import("../products/schemas/product.schema").ProductDocument[];
        categories: string[];
        recommendations: string[];
    }>;
    getNavigationHelp(userId: string, section?: string): Promise<{
        message: string;
        guide: any;
        quickActions: {
            text: string;
            action: string;
        }[];
    }>;
    compareProducts(userId: string, productIds: string[]): Promise<{
        message: string;
        comparison: {
            products: {
                id: any;
                name: string;
                price: number;
                discount: number;
                finalPrice: number;
                rating: number;
                reviews: number;
                vendor: import("mongoose").Types.ObjectId;
                inStock: boolean;
                specifications: Record<string, any>;
            }[];
            analysis: {
                cheapest: import("../products/schemas/product.schema").Product & import("mongoose").Document<any, any, any>;
                highestRated: import("../products/schemas/product.schema").Product & import("mongoose").Document<any, any, any>;
                bestValue: import("../products/schemas/product.schema").Product & import("mongoose").Document<any, any, any>;
            };
        };
        recommendations: string[];
    }>;
    getRecommendations(userId: string, productId: string): Promise<{
        message: string;
        baseProduct: {
            id: any;
            name: string;
            category: string;
        };
        recommendations: {
            related: import("../products/schemas/product.schema").ProductDocument[];
            fromSameVendor: import("../products/schemas/product.schema").ProductDocument[];
            trending: import("../products/schemas/product.schema").ProductDocument[];
        };
        insights: string[];
    }>;
}
