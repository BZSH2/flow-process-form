// openApi/index.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import modules from './modules'; // 👈 ESM 必须加 .js
import axios from 'axios';

interface OpenApiConfig {
  output: string;
}

class OpenApi {
  private config: OpenApiConfig;

  constructor(config: OpenApiConfig) {
    this.config = config;
  }

  private async postOpenApiJSON() {
    const { data } = await axios.post(
      'https://m1.apifoxmock.com/m1/7827428-7575526-default/postOpenApiJson',
      {
        coke: JSON.stringify(modules),
      }
    );
    return data;
  }

  private generateFolder(output: string) {
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true });
    }
  }

  // private async generateApi(apiSpec: any, outputDir: string) {
  //   const title = apiSpec.info?.title || 'default-api';
  //   const safeTitle = String(title).replace(/[^a-zA-Z0-9-_]/g, '_');
  //   const tempFile = path.resolve(process.cwd(), `openapi-${safeTitle}-${Date.now()}.json`);

  //   await fs.promises.writeFile(tempFile, JSON.stringify(apiSpec, null, 2));

  //   try {
  //     // await generate({
  //     //   input: {
  //     //     target: tempFile,
  //     //   },
  //     //   output: {
  //     //     target: outputDir,
  //     //     client: 'axios',
  //     //     mode: 'tags-split', // 按 tag 拆分
  //     //     clean: true,
  //     //     prettier: true,
  //     //     override: {
  //     //       mutator: {
  //     //         // 👇 指向你的本地 request 函数
  //     //         path: path.resolve(process.cwd(), 'src/utils/request/orval-mutator.ts'),
  //     //         name: 'request', // 必须与导出名一致
  //     //       },
  //     //     },
  //     //   },
  //     // });

  //     console.log(`✅ Generated API for "${apiSpec.info?.title}"`);
  //   } finally {
  //     try {
  //       await fs.promises.unlink(tempFile);
  //     } catch {}
  //   }
  // }

  async open() {
    console.log('📡 Fetching OpenAPI specs from Apifox...');
    const { data } = await this.postOpenApiJSON();

    const specs = Array.isArray(data) ? data : [data]; // 兼容单个或多个

    for (const api of specs) {
      if (!api || typeof api !== 'object' || !api.openapi) {
        console.warn('⚠️ Skipping invalid spec:', api);
        continue;
      }

      const title = api.info?.title || 'default-api';
      const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, '_');
      const output = path.resolve(this.config.output, safeTitle);

      this.generateFolder(output);
      // await this.generateApi(api, output);
    }

    console.log('🎉 All APIs generated successfully!');
  }
}

const openApi = new OpenApi({
  output: fileURLToPath(new URL('../src/api', import.meta.url)),
});

openApi.open().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
