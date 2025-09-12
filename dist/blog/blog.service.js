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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("./schemas/article.schema");
let BlogService = class BlogService {
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async create(createArticleDto) {
        const created = new this.articleModel(createArticleDto);
        return created.save();
    }
    async findAll(filter) {
        const query = {};
        if (filter.authorId)
            query.authorId = filter.authorId;
        if (filter.tag)
            query.tags = filter.tag;
        if (filter.search)
            query.$text = { $search: filter.search };
        return this.articleModel.find(query).exec();
    }
    async findOne(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async update(id, updateArticleDto) {
        const article = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async remove(id) {
        const result = await this.articleModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Article not found');
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogService);
//# sourceMappingURL=blog.service.js.map