"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let PinataService = class PinataService {
    constructor() {
        this.pinataApiKey = process.env.PINATA_API_KEY;
        this.pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
        this.pinataBaseUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    }
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        try {
            const response = await axios_1.default.post(this.pinataBaseUrl, formData, {
                maxBodyLength: Infinity,
                headers: {
                    ...formData.getHeaders(),
                    pinata_api_key: this.pinataApiKey,
                    pinata_secret_api_key: this.pinataSecretApiKey,
                },
            });
            const { IpfsHash } = response.data;
            return {
                uri: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
                hash: IpfsHash,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to upload file to Pinata');
        }
    }
};
exports.PinataService = PinataService;
exports.PinataService = PinataService = __decorate([
    (0, common_1.Injectable)()
], PinataService);
//# sourceMappingURL=pinata.service.js.map