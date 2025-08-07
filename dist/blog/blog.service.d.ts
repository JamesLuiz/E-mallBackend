import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
export declare class BlogService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(filter: ArticleFilterDto): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<void>;
}
