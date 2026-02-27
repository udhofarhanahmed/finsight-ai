import { createApp } from "../server/_core/app";

const appPromise = createApp({ includeFrontend: false });

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
