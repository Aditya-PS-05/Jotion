import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    .beforeDelete(({ ctx, fileInfo }) => {
      return true;
    }),
});

let cachedHandler: ReturnType<typeof createEdgeStoreNextHandler> | null = null;
const getHandler = () => {
  if (!cachedHandler) {
    cachedHandler = createEdgeStoreNextHandler({ router: edgeStoreRouter });
  }
  return cachedHandler;
};

export const GET = (req: NextRequest) => getHandler()(req);
export const POST = (req: NextRequest) => getHandler()(req);

export type EdgeStoreRouter = typeof edgeStoreRouter;
