// openApi/index.ts
import { fileURLToPath } from 'url';
import modules from './modules';
import axios from 'axios';
import { type OpenAPIObject } from 'openapi3-ts/oas31'
import ApiGenerator from './generate'
import { generatorFolder } from './utils/utils'
import { OpenApiConfig } from './utils'

class OpenApi {
  private config: OpenApiConfig;

  constructor(config: OpenApiConfig) {
    this.config = config;
  }

  // 获取 openapi json 数据（使用 Apifox）
  private async postOpenApiJSON() {
    const { data: {data} } = await axios.post(
      'https://m1.apifoxmock.com/m1/7827428-7575526-default/postOpenApiJson',
      {
        coke: JSON.stringify(modules),
      }
    );
    return data;
  }

  public async open() {
    // 1. 获取openapi数据
    const data: OpenAPIObject[] = await this.postOpenApiJSON();

    // 2. 创建 url/api文件夹
    generatorFolder(this.config.output)

    // 3. 生成api相关
    new ApiGenerator(this.config, data).generator()
  }
}

const openApi = new OpenApi({
  output: fileURLToPath(new URL('../src/api', import.meta.url)),
});

openApi.open().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
