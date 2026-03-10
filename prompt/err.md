when "npx prisma migrate dev" successfully, but when seed failed 



$ npm run seed

> portfolio-aziz@0.1.0 seed
> tsx prisma/seed.ts

Start seeding...
DriverAdapterError: pool timeout: failed to retrieve a connection from pool after 10002ms
    (pool connections: active=0 idle=0 limit=10)
    at PrismaMariaDbAdapter.onError (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\adapter-mariadb\dist\index.js:353:11)
    at D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\adapter-mariadb\dist\index.js:394:74
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async PrismaMariaDbAdapter.startTransaction (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\adapter-mariadb\dist\index.js:394:18)
    at async Ft.#r (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client-engine-runtime\src\transaction-manager\transaction-manager.ts:125:31)
    at async Ft.startInternalTransaction (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client-engine-runtime\src\transaction-manager\transaction-manager.ts:92:12)
    at async e.interpretNode (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client-engine-runtime\src\interpreter\query-interpreter.ts:263:33)
    at async e.run (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client-engine-runtime\src\interpreter\query-interpreter.ts:96:23)
    at async e.execute (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client\src\runtime\core\engines\client\LocalExecutor.ts:81:12)
    at async Dt.request (D:\Data_Aziz\2_Project_Web\Projects_NextJS\portfolio-aziz\node_modules\@prisma\client\src\runtime\core\engines\client\ClientEngine.ts:472:22) {
  cause: {
    originalCode: '45028',
    originalMessage: 'pool timeout: failed to retrieve a connection from pool after 10002ms\n' +
      '    (pool connections: active=0 idle=0 limit=10)',
    kind: 'mysql',
    code: 45028,
    message: 'pool timeout: failed to retrieve a connection from pool after 10002ms\n' +
      '    (pool connections: active=0 idle=0 limit=10)',
    state: 'HY000',
    cause: "(conn:41, no: 1524, SQLState: HY000) Plugin 'mysql_native_password' is not loaded\n" +
      '    (pool connections: active=0 idle=0 limit=10)'
  },
  clientVersion: '7.2.0'
}