import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ID!,
    secretAccessKey: process.env.AWS_KEY!,
  },
});
const BUCKET = "isingmodeldata";

const appRouter = trpc
  .router()
  .mutation("imageupload", {
    input: z.object({
      image: z.string(),
      pathname: z.string(),
      index: z.number(),
      date: z.string(),
    }),
    async resolve({ input }) {
      const buf = Buffer.from(
        input.image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      let params = {
        Key: `${input.pathname}/${input.date}/img/${input.index}.png`,
        Bucket: BUCKET,
        Body: buf,
        ACL: "public-read",
        ContentType: "image/png",
      };

      try {
        await s3.send(new PutObjectCommand(params));
      } catch (e) {
        throw new Error(`${e}`);
      }

      return {
        link: `https://${BUCKET}.s3.amazonaws.com${input.pathname}/${input.date}/img/${input.index}.png`,
      };
    },
  })
  .mutation("dataupload", {
    input: z.object({
      pathname: z.string(),
      date: z.string(),
      settings: z.object({
        initialTemp: z.number().nullable(),
        finalTemp: z.number().nullable(),
        tempStep: z.number().nullable(),
        fixedTemp: z.boolean(),
        qpotts: z.number(),
        equilibriationDelay: z.number().nullable(),
        numberOfCycles: z.number().nullable(),
        latticeSize: z.number(),
        stepsPerFrame: z.number().nullable(),
        couplingStrength: z.number(),
        magneticField: z.number().nullable(),
        localMagneticField: z.number().nullable(),
        magnetism: z.string(),
        boundariesConditions: z.string(),
        geometicPattern: z.string(),
        fixedSpin: z.boolean(),
        nanotubeSimulation: z.object({
          width: z.number().nullable(),
          height: z.number().nullable(),
          diameter: z.number().nullable(),
          spin: z.boolean(),
        }),
        proportionSpin: z.object({
          positive: z.number().nullable(),
          negative: z.number().nullable(),
        }),
      }),
      data: z.array(
        z.object({
          cycles: z.object({
            currentCycle: z.number(),
            totalCycles: z.number(),
          }),
          framesInfo: z.object({
            savedFrames: z.number(),
            totalFrames: z.number(),
          }),
          steps: z.number(),
          temperature: z.number(),
          energy: z.number(),
          totalEnergy: z.number(),
          averageEnergy: z.number().nullable(),
          sigmaEnergy: z.number().nullable(),
          magnetization: z.number(),
          totalMagnetization: z.number().nullable(),
          averageMagnetization: z.number().nullable(),
          sigmaMagnetization: z.number().nullable(),
        })
      ),
    }),
    async resolve({ input }) {
      let params = {
        Key: `${input.pathname}/${input.date}/data.json`,
        Bucket: BUCKET,
        Body: JSON.stringify(input),
        ACL: "public-read",
        ContentType: "text/plain",
      };
      try {
        await s3.send(new PutObjectCommand(params));
      } catch (e) {
        throw new Error(`${e}`);
      }
      return {
        link: `https://${BUCKET}.s3.amazonaws.com${input.pathname}/${input.date}/data/data.json`,
      };
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  batching: {
    enabled: false,
  },
  maxBodySize: 100000,
  createContext: () => null,
});
