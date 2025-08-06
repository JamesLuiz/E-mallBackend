import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const created = new this.articleModel(createArticleDto);
    return created.save();
  }

  async findAll(filter: ArticleFilterDto): Promise<Article[]> {
    const query: any = {};
    if (filter.authorId) query.authorId = filter.authorId;
    if (filter.tag) query.tags = filter.tag;
    if (filter.search) query.$text = { $search: filter.search };
    return this.articleModel.find(query).exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Article not found');
  }
}
