import { BlogService } from './blog.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(filter: ArticleFilterDto): Promise<import("./schemas/article.schema").Article[]>;
    findOne(id: string): Promise<import("./schemas/article.schema").Article>;
    create(createArticleDto: CreateArticleDto): Promise<import("./schemas/article.schema").Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<import("./schemas/article.schema").Article>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
